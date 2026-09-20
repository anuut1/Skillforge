import mammoth from 'mammoth';

/**
 * Extracts searchable text from a DOCX Buffer using mammoth.
 * Throws clean, specific errors if the file is empty, corrupted, or has no usable text.
 */
export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<string> {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Word (.docx) file buffer is empty or invalid.');
  }

  // Basic ZIP/DOCX magic number check (PK\x03\x04 or PK\x05\x06 or PK\x07\x08)
  const header = buffer.subarray(0, 4);
  const isZip = header[0] === 0x50 && header[1] === 0x4B; // 'P', 'K'
  if (!isZip) {
    throw new Error('Invalid file format: File does not have a valid DOCX (ZIP container) header.');
  }

  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result?.value?.trim() || '';

    if (!text || text.length < 20) {
      throw new Error('Word (.docx) document contains no extractable text layer or is empty. Please ensure the document contains readable text or copy-paste your resume content.');
    }

    // Guard against returning raw binary chunks
    if (text.includes('\0\0\0') || text.startsWith('PK')) {
      throw new Error('DOCX contains unreadable binary data instead of text.');
    }

    return text;
  } catch (err: any) {
    if (err.message && err.message.includes('extractable text layer')) {
      throw err;
    }
    throw new Error(`Failed to extract text from Word document: ${err.message || 'Corrupted or unreadable document.'}`);
  }
}
