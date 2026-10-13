
import { embedTexts } from "../llm/openai.js";
import { queryVectors } from "../vectorStore/pinecone.js";

export const retrieveRelevantChunks = async (
  question,
  topK = Number(process.env.TOP_K || 5)
) => {
  if (!question || typeof question !== "string") {
    throw new Error("A valid question is required");
  }

  // Convert the user's question into an embedding.
  const [questionEmbedding] = await embedTexts([
    question.trim(),
  ]);

  if (!questionEmbedding) {
    throw new Error("Failed to generate question embedding");
  }

  // Search Pinecone for similar document chunks.
  const matches = await queryVectors(
    questionEmbedding,
    topK
  );

  // Return relevant chunks and their source metadata.
  return matches
    .filter((match) => match.metadata?.text)
    .map((match) => ({
      text: match.metadata.text,
      documentId: match.metadata.documentId,
      documentName: match.metadata.documentName,
      chunkIndex: match.metadata.chunkIndex,
      score: match.score ?? 0,
    }));
};
