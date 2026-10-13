
export const chunkText = (
  text,
  chunkSize = 1000,
  overlap = 150
) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalizedText) return [];

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error(
      "Overlap must be non-negative and smaller than chunk size"
    );
  }

  const chunks = [];
  let start = 0;

  while (start < normalizedText.length) {
    let end = Math.min(
      start + chunkSize,
      normalizedText.length
    );

    // Prefer splitting at a word boundary.
    if (end < normalizedText.length) {
      const boundary = normalizedText.lastIndexOf(" ", end);

      if (boundary > start + chunkSize * 0.7) {
        end = boundary;
      }
    }

    const chunk = normalizedText.slice(start, end).trim();

    if (chunk) chunks.push(chunk);

    if (end >= normalizedText.length) break;

    start = end - overlap;
  }

  return chunks;
};
