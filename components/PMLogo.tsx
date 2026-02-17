import React from 'react';

interface PMLogoProps {
  className?: string;
  height?: string;
}

const PMLogoSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='70' font-family='Arial, sans-serif' font-size='60' font-weight='bold' fill='%232BB3A3' text-anchor='middle'%3EPM%3C/text%3E%3C/svg%3E`;

const PMLogoComponent: React.FC<PMLogoProps> = ({ className = '', height = 'h-10' }) => {
  return (
    <img 
      src={PMLogoSVG}
      alt="PM Logo"
      className={`${height} w-auto ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default PMLogoComponent;
