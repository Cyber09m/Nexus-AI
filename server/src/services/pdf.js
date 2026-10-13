import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { HttpError } from '../errors.js';

export async function extractPdfText(buffer) {
  let text = '';
  try {
    text = (await pdfParse(buffer)).text || '';
  } catch {
    throw new HttpError(422, "We couldn't open that PDF. Make sure it isn't password-protected or corrupted.", 'BAD_FILE');
  }
  text = text.replace(/\s+\n/g, '\n').trim();
  if (text.length < 150) {
    throw new HttpError(422, "We couldn't find readable text in that PDF. Scanned resumes need to be exported as a text-based PDF.", 'BAD_FILE');
  }
  return text;
}
