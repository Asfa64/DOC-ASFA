import React from 'react';
import { useButtonStore } from '../store/buttonStore';
import { useUserStore } from '../store/userStore';
import { CustomButton } from './CustomButton';
import { useNavigate } from 'react-router-dom';

const ButtonGrid: React.FC = () => {
  const buttons = useButtonStore((state) => state.buttons);
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate();

  const handleButtonClick = (url: string, type: 'onedrive' | 'external') => {
    if (type === 'onedrive') {
      navigate(`/viewer?url=${encodeURIComponent(url)}`);
    } else {
      window.open(url, '_blank');
    }
  };

  // Filtrer les boutons en fonction du profil de l'utilisateur
  const filteredButtons = buttons.filter(button => 
    currentUser?.profileId && button.profileIds.includes(currentUser.profileId)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredButtons.map((button) => (
        <CustomButton
          key={button.id}
          {...button}
          onClick={() => handleButtonClick(button.link.url, button.link.type)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;