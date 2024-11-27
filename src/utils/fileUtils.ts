import localforage from 'localforage';

// Initialize localforage instance for PDF storage
const pdfStorage = localforage.createInstance({
  name: 'pdfStorage',
  storeName: 'pdfs',
  description: 'Storage for PDF files'
});

// Initialize localforage instance for PDF metadata
const pdfMetadataStorage = localforage.createInstance({
  name: 'pdfMetadataStorage',
  storeName: 'metadata',
  description: 'Storage for PDF metadata'
});

interface PDFMetadata {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: number;
}

const validatePDF = (file: File) => {
  if (file.type !== 'application/pdf') {
    throw new Error('Le fichier doit être un PDF');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Le fichier ne doit pas dépasser 10MB');
  }
};

const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const safeOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${timestamp}-${randomString}-${safeOriginalName}`;
};

export const uploadPDF = async (file: File): Promise<string> => {
  try {
    validatePDF(file);

    const filename = generateUniqueFilename(file.name);
    
    // Store the PDF file
    await pdfStorage.setItem(filename, file);
    
    // Store the metadata
    const metadata: PDFMetadata = {
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: Date.now()
    };
    await pdfMetadataStorage.setItem(filename, metadata);

    console.log('PDF uploaded successfully:', {
      filename,
      size: file.size,
      type: file.type
    });

    return filename;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier');
  }
};

export const getPDF = async (filename: string): Promise<Blob | null> => {
  try {
    const file = await pdfStorage.getItem<Blob>(filename);
    if (!file) {
      console.warn('PDF not found:', filename);
      return null;
    }
    return file;
  } catch (error) {
    console.error('Error retrieving PDF:', error);
    return null;
  }
};

export const getPDFMetadata = async (filename: string): Promise<PDFMetadata | null> => {
  try {
    return await pdfMetadataStorage.getItem(filename);
  } catch (error) {
    console.error('Error retrieving PDF metadata:', error);
    return null;
  }
};

export const deletePDF = async (filename: string): Promise<void> => {
  try {
    await Promise.all([
      pdfStorage.removeItem(filename),
      pdfMetadataStorage.removeItem(filename)
    ]);
    console.log('PDF deleted successfully:', filename);
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw new Error('Erreur lors de la suppression du fichier');
  }
};