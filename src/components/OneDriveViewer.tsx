import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OneDriveViewerProps {
  url: string;
}

export const OneDriveViewer: React.FC<OneDriveViewerProps> = ({ url }) => {
  const navigate = useNavigate();

  // Transformer l'URL OneDrive en URL d'intégration
  const getEmbedUrl = (originalUrl: string) => {
    // Vérifier si c'est une URL OneDrive
    if (originalUrl.includes('1drv.ms') || originalUrl.includes('onedrive.live.com')) {
      // Remplacer "view.aspx" par "embed" pour les liens OneDrive
      return originalUrl.replace('view.aspx', 'embed').replace('1drv.ms', 'onedrive.live.com/embed');
    }
    return originalUrl;
  };

  const embedUrl = getEmbedUrl(url);

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
      <div className="flex-1 w-full">
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Document OneDrive"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        />
      </div>
    </div>
  );
};