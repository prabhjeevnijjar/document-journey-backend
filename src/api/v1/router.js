const express = require("express");
const agreementsRouter = require("./agreements/routes");
const authRouter = require("./auth/routes");
const contactsRouter = require("./contacts/routes");
const documentsRouter = require("./documents/routes");
const activityRouter = require("./activity/routes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/agreements", agreementsRouter);
router.use("/contacts", contactsRouter);
router.use("/documents", documentsRouter);
router.use("/activity", activityRouter);


module.exports = router;
