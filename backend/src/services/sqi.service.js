const weights = require("../utils/weights");

function computeSQI(input) {
  const { student_id, attempts } = input;

  let totalWeighted = 0;
  let totalMax = 0;

  const topicMap = {};
  const conceptMap = {};

  attempts.forEach((q) => {
    const base = q.correct ? q.marks : -q.neg_marks;

    const importanceW = weights.importance[q.importance] || 1;
    const difficultyW = weights.difficulty[q.difficulty] || 1;
    const typeW = weights.type[q.type] || 1;

    let weighted =
      base * importanceW * difficultyW * typeW;

    // Time penalties
    if (q.time_spent_sec > 2 * q.expected_time_sec) {
      weighted *= 0.8;
    } else if (q.time_spent_sec > 1.5 * q.expected_time_sec) {
      weighted *= 0.9;
    }

    // Marked for review but wrong
    if (q.marked_review && !q.correct) {
      weighted *= 0.9;
    }

    // Revisit & correct bonus
    if (q.correct && q.revisits > 0) {
      weighted += 0.2 * q.marks;
    }

    const maxForQ =
      q.marks * importanceW * difficultyW * typeW;

    totalWeighted += weighted;
    totalMax += maxForQ;

    // Topic aggregation
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { weighted: 0, max: 0 };
    }
    topicMap[q.topic].weighted += weighted;
    topicMap[q.topic].max += maxForQ;

    // Concept aggregation
    const conceptKey = `${q.topic}__${q.concept}`;
    if (!conceptMap[conceptKey]) {
      conceptMap[conceptKey] = {
        topic: q.topic,
        concept: q.concept,
        weighted: 0,
        max: 0,
        wrongOnce: false,
        importance: importanceW,
        avgTimeRatio: 0,
        count: 0
      };
    }

    if (!q.correct) {
      conceptMap[conceptKey].wrongOnce = true;
    }

    conceptMap[conceptKey].weighted += weighted;
    conceptMap[conceptKey].max += maxForQ;
    conceptMap[conceptKey].avgTimeRatio +=
      q.time_spent_sec / q.expected_time_sec;
    conceptMap[conceptKey].count += 1;
  });

  const clamp = (v) => Math.max(0, Math.min(100, v));

  const overall_sqi = clamp((totalWeighted / totalMax) * 100);

  // Topic scores
  const topic_scores = Object.entries(topicMap).map(
    ([topic, data]) => ({
      topic,
      sqi: clamp((data.weighted / data.max) * 100)
    })
  );

  // Concept scores
  const concept_scores = Object.values(conceptMap).map(
    (c) => ({
      topic: c.topic,
      concept: c.concept,
      sqi: clamp((c.weighted / c.max) * 100)
    })
  );

  // Ranked concepts for Summary Customizer Agent
  const ranked_concepts_for_summary = Object.values(
    conceptMap
  )
    .map((c) => {
      const avgRatio = c.avgTimeRatio / c.count;

      let speedScore = 0.7;
      if (avgRatio < 1) speedScore = 1;
      else if (avgRatio > 1.5) speedScore = 0.4;

      const diagnosticQuality =
        1 - clamp((c.weighted / c.max) * 100) / 100;

      const weight =
        0.4 * (c.wrongOnce ? 1 : 0) +
        0.25 * c.importance +
        0.2 * speedScore +
        0.15 * diagnosticQuality;

      const reasons = [];
      if (c.wrongOnce) reasons.push("Wrong earlier");
      if (c.importance >= 1)
        reasons.push("High importance (A)");
      if (diagnosticQuality > 0.4)
        reasons.push("Low diagnostic score");

      return {
        topic: c.topic,
        concept: c.concept,
        weight: Number(weight.toFixed(2)),
        reasons
      };
    })
    .sort((a, b) => b.weight - a.weight);

  return {
    student_id,
    overall_sqi: Number(overall_sqi.toFixed(2)),
    topic_scores,
    concept_scores,
    ranked_concepts_for_summary,
    metadata: {
      diagnostic_prompt_version: "v1",
      computed_at: new Date().toISOString(),
      engine: "sqi-v0.1"
    }
  };
}

module.exports = { computeSQI };
