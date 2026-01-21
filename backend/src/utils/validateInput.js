function validateInput(data) {
  if (!data.student_id) {
    throw new Error("student_id is required");
  }

  if (!Array.isArray(data.attempts)) {
    throw new Error("attempts must be an array");
  }

  data.attempts.forEach((a, index) => {
    const requiredFields = [
      "topic",
      "concept",
      "importance",
      "difficulty",
      "type",
      "correct",
      "marks",
      "neg_marks",
      "expected_time_sec",
      "time_spent_sec",
      "marked_review",
      "revisits"
    ];

    requiredFields.forEach((field) => {
      if (a[field] === undefined) {
        throw new Error(
          `Missing field '${field}' in attempt index ${index}`
        );
      }
    });
  });

  return true;
}

module.exports = { validateInput };
