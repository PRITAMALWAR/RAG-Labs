
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export const extractText = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided");
  }

  const buffer = file.buffer;
  const fileName = file.originalname.toLowerCase();
  const mimeType = file.mimetype;

  // Extract text from PDF
  if (
    mimeType === "application/pdf" ||
    fileName.endsWith(".pdf")
  ) {
    const result = await pdf(buffer);
    return result.text.trim();
  }

  // Extract text from DOCX
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  // Extract text from TXT and Markdown
  if (
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md") ||
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {
    return buffer.toString("utf8").trim();
  }

  throw new Error(
    "Unsupported file type. Upload PDF, TXT, MD, or DOCX."
  );
};
