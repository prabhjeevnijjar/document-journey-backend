const agreementsRouter = require("express").Router();

// get all agreements with pagination
agreementsRouter.get("/", async () => {});

// create a new agreement
agreementsRouter.post("/", async () => {});

// get a specific agreement by ID
agreementsRouter.get("/:id", async () => {});

module.exports = agreementsRouter;
