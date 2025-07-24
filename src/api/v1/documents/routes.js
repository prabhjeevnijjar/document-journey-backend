const documentsRouter = require("express").Router();

// get all document with pagination
documentsRouter.get("/", async () => {});

// create a new document
documentsRouter.post("/", async () => {});

// get a specific document by ID
documentsRouter.get("/:id", async () => {});

module.exports = documentsRouter;
