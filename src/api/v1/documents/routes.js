const documentsRouter = require("express").Router();
const prisma = require("../../../../prisma/prismaClient");
const authMiddleware = require("../../../middleware/authMiddleware");

// get all document with pagination
documentsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [documents, totalDocuments] = await Promise.all([
      prisma.document.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.document.count({
        where: { creatorId: userId },
      }),
    ]);

    return res.status(200).json({
      status: "success",
      message: "Documents fetched successfully",
      data: {
        documents,
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching documents with pagination:", error);
    return res.status(500).json({
      status: "failure",
      error: "Failed to fetch documents",
      data: null,
    });
  }
});

// create a new document
documentsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, fileUrl, mimeType, fileSize, originalFilename } = req.body;

    if (!fileUrl || !originalFilename) {
      return res
        .status(400)
        .json({ status: "failure", message: "Missing file data" });
    }

    const document = await prisma.document.create({
      data: {
        name,
        fileUrl,
        mimeType,
        fileSize,
        originalFilename,
        creatorId: req.user.id,
      },
    });

    return res
      .status(201)
      .json({
        status: "success",
        data: document,
        message: "Document created successfully",
      });
  } catch (error) {
    console.error("Error uploading document:", error);
    return res
      .status(500)
      .json({ status: "failure", message: "Failed to upload document" });
  }
});

// get a specific document by ID
documentsRouter.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: Number(id),
        creatorId: req.user.id,
      },
    });

    if (!document) {
      return res
        .status(404)
        .json({ status: "failure", message: "Document not found", data: null });
    }

    return res.status(200).json({
      status: "success",
      message: "Document found",
      data: document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res
      .status(500)
      .json({ status: "failure", message: "Failed to fetch document" });
  }
});

module.exports = documentsRouter;
