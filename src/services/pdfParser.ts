import * as pdfjsLib from 'pdfjs-dist';

// Configure PDFJS worker path for Vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error, attempting raw fallback:', error);
    try {
      const text = await file.text();
      // Simple sanitize to extract printable ascii & basic unicode characters
      const sanitized = text.replace(/[^\x20-\x7E\n\r\t]/g, '');
      if (sanitized.length > 50) return sanitized.trim();
      throw new Error('Fallback text extraction yielded insufficient data.');
    } catch (e) {
      throw new Error('Failed to extract text from PDF file. Please ensure it is a valid PDF document with selectable text.');
    }
  }
}
