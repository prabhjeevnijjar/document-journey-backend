const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../../../prisma/prismaClient");
const { sendOtpMail } = require("../../../helper/mailer");
const { jwtSecret, otpExpireMinutes } = require("../../../config");
const authRouter = express.Router();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateExpiresAt = () =>
  new Date(Date.now() + 1000 * 60 * Number(otpExpireMinutes));

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || password !== confirmPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.isVerified)
      return res.status(400).json({ message: "Email exists" });

    // delete the unverified user as they can not access the system anyways
    if (existing && !existing.isVerified)
      await prisma.user.delete({
        where: {
          email: email,
        },
      });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: "CREATOR" },
    });

    const otp = generateOTP();
    const expiresAt = generateExpiresAt();

    // delete any old unverified otps before creating new one
    await prisma.otpToken.deleteMany({
      where: { userId: user.id, verifiedAt: null },
    });

    await prisma.otpToken.upsert({
      data: {
        userId: user.id,
        otpCode: otp,
        createdAt: new Date(),
        expiresAt,
        purpose: "SIGNUP",
      },
    });

    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid user" });
    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });
    const token = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        otpCode: otp,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
        purpose: "SIGNUP",
      },
    });

    if (!token)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    await prisma.otpToken.update({
      where: { id: token.id },
      data: { verifiedAt: new Date() },
    });
    await prisma.user.update({ where: { email }, data: { isVerified: true } });

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "OTP verified", token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    if (user && !user.isVerified)
      return res.status(403).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

authRouter.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // Get the latest unverified OTP
    const existingOtp = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        purpose: "SIGNUP",
        verifiedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const cooldownMinutes = parseInt(
      process.env.RESEND_OTP_COOLDOWN_MINUTES || "2"
    );

    if (
      existingOtp &&
      new Date() - new Date(existingOtp.createdAt) < cooldownMinutes * 60 * 1000
    ) {
      return res.status(429).json({
        message: `Please wait ${cooldownMinutes} minutes before requesting a new OTP.`,
      });
    }

    const otp = generateOTP();
    const expiresAt = generateExpiresAt();

    // Delete all old, expired or unverified OTPs (cleanup)
    await prisma.otpToken.deleteMany({
      where: {
        userId: user.id,
        purpose: "SIGNUP",
        verifiedAt: null,
      },
    });

    // Create a new OTP
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        otpCode: otp,
        createdAt: new Date(),
        expiresAt,
        purpose: "SIGNUP",
      },
    });

    try {
      await sendOtpMail(email, otp);
      return res.status(200).json({ message: "OTP resent to your email." });
    } catch (error) {
      console.error("Email send failed:", error);
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try again." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


authRouter.get("/me", async (req, res) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Fallback to Authorization header (for client-side fetch)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "User not found or unverified" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = authRouter;
