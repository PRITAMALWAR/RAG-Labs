
import { Pinecone } from "@pinecone-database/pinecone";

let pineconeIndex;

const getIndex = () => {
  if (pineconeIndex) return pineconeIndex;

  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!apiKey || !indexName) {
    throw new Error(
      "PINECONE_API_KEY and PINECONE_INDEX_NAME are required"
    );
  }

  const pinecone = new Pinecone({ apiKey });

  pineconeIndex = pinecone.index({ name: indexName });

  return pineconeIndex;
};

export const upsertVectors = async (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return;
  }

  const index = getIndex();
  const batchSize = 100;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    await index.upsert({ records: batch });
  }
};

export const queryVectors = async (vector, topK = 5) => {
  const index = getIndex();

  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return result.matches || [];
};

export const deleteDocumentVectors = async (documentId) => {
  const index = getIndex();

  // This ID-based deletion avoids relying on metadata-filter
  // deletion, which has limitations on some index types.
  const ids = [];
  let pageToken;

  do {
    const page = await index.listPaginated({
      prefix: `${documentId}-`,
      limit: 100,
      ...(pageToken ? { paginationToken: pageToken } : {}),
    });

    for (const vector of page.vectors || []) {
      if (vector.id) ids.push(vector.id);
    }

    pageToken = page.pagination?.next;
  } while (pageToken);

  if (ids.length > 0) {
    await index.deleteMany({ ids });
  }

  return ids.length;
};
