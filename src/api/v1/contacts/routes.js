const contactsRouter = require("express").Router();

// get all contact with pagination
contactsRouter.get("/", async () => {});

// create a new contact
contactsRouter.post("/", async () => {});

// get a specific contact by ID
contactsRouter.get("/:id", async () => {});

module.exports = contactsRouter;
