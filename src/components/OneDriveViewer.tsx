import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OneDriveViewerProps {
  url: string;
}

export const OneDriveViewer: React.FC<OneDriveViewerProps> = ({ url }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-accent1 hover:text-opacity-80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour à l'accueil</span>
        </button>
      </div>
      <iframe
        src={url}
        className="flex-1 w-full"
        allow="autoplay"
        title="Document SharePoint"
      />
    </div>
  );
};