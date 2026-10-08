import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';

interface ResponsiveAdBannerProps {
  className?: string;
}

export const ResponsiveAdBanner: React.FC<ResponsiveAdBannerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      {/* Desktop / Tablet: 728x90 Leaderboard */}
      <div className="hidden md:flex justify-center w-full">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Mobile: 320x50 Mobile Banner */}
      <div className="flex md:hidden justify-center w-full">
        <AdsterraBanner type="320x50" />
      </div>
    </div>
  );
};
