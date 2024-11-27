import React, { useState } from 'react';
import { useButtonStore } from '../store/buttonStore';
import { useUserStore } from '../store/userStore';
import { CustomButton } from './CustomButton';
import { PDFViewer } from './PDFViewer';
import { CustomButton as CustomButtonType } from '../types';

const ButtonGrid: React.FC = () => {
  const buttons = useButtonStore((state) => state.buttons);
  const currentUser = useUserStore((state) => state.currentUser);
  const [selectedButton, setSelectedButton] = useState<CustomButtonType | null>(null);

  const handleButtonClick = (button: CustomButtonType) => {
    if (button.link.type === 'pdf') {
      setSelectedButton(button);
    } else {
      window.open(button.link.url, '_blank');
    }
  };

  const handleClosePDF = () => {
    setSelectedButton(null);
  };

  // Filter buttons based on user profile
  const filteredButtons = buttons.filter(button => 
    currentUser?.profileId && button.profileIds.includes(currentUser.profileId)
  );

  if (selectedButton) {
    return (
      <PDFViewer
        url={selectedButton.link.url}
        title={selectedButton.title}
        onClose={handleClosePDF}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredButtons.map((button) => (
        <CustomButton
          key={button.id}
          {...button}
          onClick={() => handleButtonClick(button)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;