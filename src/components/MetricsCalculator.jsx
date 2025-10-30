export const tokenize = (text) => {
  if (!text && text !== "") return [];
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
};

/* Calculate BLEU score (simplified unigram version) */
export const calculateBLEU = (reference, candidate) => {
  const refTokens = tokenize(reference);
  const candTokens = tokenize(candidate);

  if (candTokens.length === 0) return 0;

  const refSet = new Set(refTokens);
  let matches = 0;
  for (const token of candTokens) {
    if (refSet.has(token)) matches++;
  }

  const precision = matches / candTokens.length;
  const brevityPenalty = Math.min(1, Math.exp(1 - refTokens.length / Math.max(1, candTokens.length)));

  return precision * brevityPenalty * 100;
};

/* Calculate token overlap percentage */
export const calculateTokenOverlap = (text1, text2) => {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return (intersection.size / union.size) * 100;
};

/* Exact match */
export const isExactMatch = (expected, actual) => {
  return String(expected).trim().toLowerCase() === String(actual).trim().toLowerCase();
};

/* F1, Precision, Recall based on token overlap */
export const calculateF1Metrics = (expected, actual) => {
  const expectedTokens = new Set(tokenize(expected));
  const actualTokens = new Set(tokenize(actual));

  if (expectedTokens.size === 0 || actualTokens.size === 0) {
    return { precision: 0, recall: 0, f1: 0 };
  }

  const truePositives = [...actualTokens].filter((t) => expectedTokens.has(t)).length;
  const precision = actualTokens.size > 0 ? (truePositives / actualTokens.size) * 100 : 0;
  const recall = expectedTokens.size > 0 ? (truePositives / expectedTokens.size) * 100 : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { precision, recall, f1 };
};

/* Calculate overall metrics for a test run */
export const calculateOverallMetrics = (results) => {
  if (!results || results.length === 0) {
    return {
      bleuScore: 0,
      f1Score: 0,
      precision: 0,
      recall: 0,
      accuracy: 0,
      exactMatch: 0,
      averageTokenOverlap: 0,
    };
  }

  let totalBleu = 0;
  let totalPrecision = 0;
  let totalRecall = 0;
  let totalF1 = 0;
  let totalTokenOverlap = 0;
  let exactMatches = 0;

  results.forEach((result) => {
    totalBleu += result.bleuScore || 0;
    totalTokenOverlap += result.tokenOverlap || 0;
    if (result.exactMatch) exactMatches++;
    const { precision, recall, f1 } = calculateF1Metrics(result.expectedAnswer || "", result.actualAnswer || "");
    totalPrecision += precision;
    totalRecall += recall;
    totalF1 += f1;
  });

  const count = results.length;
  return {
    bleuScore: totalBleu / count,
    f1Score: totalF1 / count,
    precision: totalPrecision / count,
    recall: totalRecall / count,
    accuracy: (exactMatches / count) * 100,
    exactMatch: (exactMatches / count) * 100,
    averageTokenOverlap: totalTokenOverlap / count,
  };
};

/* Process uploaded datasets and calculate per-question results */
export const processTestResults = (goldenData, actualData) => {
  const actualMap = new Map();
  (actualData || []).forEach((item) => {
    const question = (item.question || item.Question || "").trim();
    const answer = item.actual_answer || item.actualAnswer || item.answer || item.Answer || "";
    if (question) actualMap.set(question.toLowerCase(), String(answer));
  });

  const results = [];
  (goldenData || []).forEach((item) => {
    const question = (item.question || item.Question || "").trim();
    const expectedAnswer = item.expected_answer || item.expectedAnswer || item.answer || item.Answer || "";
    const actualAnswer = actualMap.get(question.toLowerCase()) || "";
    if (question && expectedAnswer !== undefined) {
      const bleuScore = calculateBLEU(expectedAnswer, actualAnswer);
      const tokenOverlap = calculateTokenOverlap(expectedAnswer, actualAnswer);
      const exactMatch = isExactMatch(expectedAnswer, actualAnswer);
      results.push({
        question,
        expectedAnswer,
        actualAnswer,
        bleuScore,
        tokenOverlap,
        exactMatch,
      });
    }
  });

  return results;
};