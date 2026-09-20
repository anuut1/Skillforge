import pdfParse from 'pdf-parse';

/**
 * Extracts searchable text from a PDF Buffer using pdf-parse.
 * Throws clean, specific errors if the file is unreadable or has no text layer.
 */
export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('PDF file buffer is empty or invalid.');
  }

  // Basic PDF magic number check (%PDF-)
  const header = buffer.subarray(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    throw new Error('Invalid file format: File does not have a valid PDF header.');
  }

  try {
    const parser = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
    const data = await parser(buffer);
    const text = data?.text?.trim() || '';

    if (!text || text.length < 20) {
      throw new Error('PDF document contains no extractable text layer (it may be a scanned image or empty). Please upload a text-based PDF or copy-paste your resume content.');
    }

    // Guard against returning raw binary chunks
    if (text.startsWith('%PDF-') || text.includes('\0\0\0')) {
      throw new Error('PDF contains unreadable binary data instead of text.');
    }

    return text;
  } catch (err: any) {
    if (err.message && err.message.includes('extractable text layer')) {
      throw err;
    }
    throw new Error(`Failed to extract text from PDF: ${err.message || 'Corrupted or unreadable document.'}`);
  }
}
