const contactsRouter = require("express").Router();
const prisma = require("../../../../prisma/prismaClient");
const authMiddleware = require("../../../middleware/authMiddleware");

// GET /api/contacts?page=1&limit=10
contactsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [contacts, totalContacts] = await Promise.all([
      prisma.contact.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contact.count({
        where: { creatorId: userId },
      }),
    ]);

    return res.status(200).json({
      status: "success",
      message: "Contacts fetched successfully",
      data: {
        contacts,
        totalContacts,
        currentPage: page,
        totalPages: Math.ceil(totalContacts / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return res
      .status(500)
      .json({ status: "failure", message: "Failed to fetch contacts" });
  }
});

// POST /api/contacts
// Body: { email: "someone@example.com" }contactsRouter.post("/", async () => {});
contactsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
        if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existing = await prisma.contact.findUnique({ where: { email } });

    if (existing) {
      return res
        .status(409)
        .json({ status: "failure", message: "Contact already exists" });
    }

    const newContact = await prisma.contact.create({
      data: {
        email,
        name,
        creatorId: userId,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "New contact created",
      data: newContact,
    });
  } catch (err) {
    console.error("Error creating contact:", err);
    return res
      .status(500)
      .json({ status: "failure", message: "Failed to create contact" });
  }
});
module.exports = contactsRouter;
