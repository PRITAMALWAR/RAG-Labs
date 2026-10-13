
import { generateAnswer } from "../llm/index.js";

export const generateRagAnswer = async ({
  question,
  chunks,
}) => {
  if (!question?.trim()) {
    throw new Error("Question is required");
  }

  if (!Array.isArray(chunks) || chunks.length === 0) {
    return {
      answer:
        "I couldn't find relevant information in the uploaded documents.",
      sources: [],
    };
  }

  const context = chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.documentName}]\n${chunk.text}`
    )
    .join("\n\n---\n\n");

  const answer = await generateAnswer({
    question,
    context,
  });

  const sources = chunks.map((chunk) => ({
    documentId: chunk.documentId,
    documentName: chunk.documentName,
    chunkIndex: chunk.chunkIndex,
    score: chunk.score,
  }));

  return {
    answer,
    sources,
  };
};
