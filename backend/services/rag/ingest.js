
import { chunkText } from "./chunk.js";
import { embedTexts } from "../llm/openai.js";
import { upsertVectors } from "../vectorStore/pinecone.js";

export const ingestDocument = async (document, text) => {
  const chunks = chunkText(
    text,
    Number(process.env.CHUNK_SIZE || 1000),
    Number(process.env.CHUNK_OVERLAP || 150)
  );

  if (chunks.length === 0) {
    throw new Error("No readable text found in document");
  }

  const batchSize = 50;
  let totalStored = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const embeddings = await embedTexts(batch);

    const records = batch.map((content, j) => ({
      id: `${document._id.toString()}-${i + j}`,
      values: embeddings[j],
      metadata: {
        documentId: document._id.toString(),
        documentName: document.originalName,
        chunkIndex: i + j,
        text: content,
      },
    }));

    await upsertVectors(records);
    totalStored += records.length;
  }

  return {
    chunkCount: totalStored,
    message: "Document ingested successfully",
  };
};
