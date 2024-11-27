export interface CustomButton {
  id: string;
  title: string;
  icon?: string;
  color: string;
  shape: 'square' | 'rounded' | 'circle';
  tooltip?: string;
  link: {
    type: 'pdf' | 'external';
    url: string;
    filename?: string;
  };
  profileIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileId?: string;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
}

export interface PDFFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: number;
  size: number;
}

export interface UploadProgress {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message?: string;
}