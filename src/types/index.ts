export interface CustomButton {
  id: string;
  title: string;
  icon?: string;
  color: string;
  shape: 'square' | 'rounded' | 'circle';
  tooltip?: string;
  link: {
    type: 'onedrive' | 'external';
    url: string;
  };
  profileIds: string[]; // IDs des profils auxquels ce bouton est attribué
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileId?: string; // ID du profil attribué à l'utilisateur
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
}

export interface OneDriveItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  webUrl: string;
  parentReference?: {
    driveId: string;
    id: string;
  };
}