import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const uploadPDF = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Le fichier doit être un PDF');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('Le fichier ne doit pas dépasser 10MB');
    }

    // Create a unique filename
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `pdfs/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload successful:', snapshot);

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('File available at:', downloadUrl);

    return downloadUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier');
  }
};