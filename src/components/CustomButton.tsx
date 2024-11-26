import React, { memo } from 'react';
import { CustomButton as CustomButtonType } from '../types';
import { FileText, ExternalLink } from 'lucide-react';

interface Props extends CustomButtonType {
  onClick: () => void;
}

export const CustomButton: React.FC<Props> = memo(({
  title,
  color,
  shape,
  tooltip,
  onClick,
  link
}) => {
  const shapeClasses = {
    square: 'rounded-none',
    rounded: 'rounded-lg',
    circle: 'rounded-full',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${shapeClasses[shape]}
        p-6 min-w-[200px] min-h-[200px]
        flex flex-col items-center justify-center gap-3
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        group relative
      `}
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-lg font-semibold text-center">{title}</span>
      <span className="text-white/80 text-sm flex items-center gap-1">
        {link.type === 'pdf' ? (
          <>
            <FileText className="h-4 w-4" />
            Voir le PDF
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Ouvrir le lien
          </>
        )}
      </span>
      
      {tooltip && (
        <div className="
          absolute -top-12 left-1/2 -translate-x-1/2
          bg-black text-white p-2 rounded
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          whitespace-nowrap
          z-10
        ">
          {tooltip}
        </div>
      )}
    </button>
  );
});