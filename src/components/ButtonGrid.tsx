import React, { useState } from 'react';
import { useButtonStore } from '../store/buttonStore';
import { useUserStore } from '../store/userStore';
import { CustomButton } from './CustomButton';
import { ArrowLeft } from 'lucide-react';

const ButtonGrid: React.FC = () => {
  const buttons = useButtonStore((state) => state.buttons);
  const currentUser = useUserStore((state) => state.currentUser);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleButtonClick = (url: string) => {
    if (url.includes('sharepoint.com')) {
      setActiveUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleReturn = () => {
    setActiveUrl(null);
  };

  // Filtrer les boutons en fonction du profil de l'utilisateur
  const filteredButtons = buttons.filter(button => 
    currentUser?.profileId && button.profileIds.includes(currentUser.profileId)
  );

  if (activeUrl) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleReturn}
            className="mb-4 flex items-center gap-2 text-accent1 hover:text-accent2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour au tableau de bord</span>
          </button>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={activeUrl}
              className="w-full h-[calc(100vh-120px)]"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredButtons.map((button) => (
        <CustomButton
          key={button.id}
          {...button}
          onClick={() => handleButtonClick(button.link.url)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;