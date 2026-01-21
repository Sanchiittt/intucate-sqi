const express = require("express");
const multer = require("multer");
const csv = require("csvtojson");

const { computeSQI } = require("../services/sqi.service");
const { validateInput } = require("../utils/validateInput");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * JSON input
 */
router.post("/compute-sqi", (req, res) => {
  try {
    validateInput(req.body);
    const result = computeSQI(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

/**
 * CSV upload
 */
router.post(
  "/compute-sqi-csv",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("CSV file required");
      }

      const jsonArray = await csv().fromString(
        req.file.buffer.toString()
      );

      const formatted = {
        student_id: req.body.student_id || "UNKNOWN",
        attempts: jsonArray.map((q) => ({
          ...q,
          correct: q.correct === "true",
          marks: Number(q.marks),
          neg_marks: Number(q.neg_marks),
          expected_time_sec: Number(q.expected_time_sec),
          time_spent_sec: Number(q.time_spent_sec),
          marked_review: q.marked_review === "true",
          revisits: Number(q.revisits)
        }))
      };

      validateInput(formatted);
      const result = computeSQI(formatted);

      res.json(result);
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  }
);

module.exports = router;
