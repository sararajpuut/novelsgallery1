import React, { useEffect, useRef } from 'react';

interface NativeBannerAdProps {
  className?: string;
}

export const NativeBannerAd: React.FC<NativeBannerAdProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = 'container-0efe5bba643d634df54d3c1cfe6c384d';
  const scriptSrc = 'https://bicea.org/21/0efe5bba643d634df54d3c1cfe6c384d';

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = '';

    // Create the div container required by Adsterra Native Banner
    const adDiv = document.createElement('div');
    adDiv.id = containerId;
    containerRef.current.appendChild(adDiv);

    // Create and append the script tag
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`w-full my-6 p-4 rounded-xl bg-white border border-[#173F35]/15 shadow-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-[#EEE8D8] pb-2 mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#173F35]">
          Recommended Stories & Offers · تجاویز
        </span>
        <span className="text-[10px] text-[#6B6B6B]/70 uppercase">Sponsored</span>
      </div>
      <div ref={containerRef} className="min-h-[100px] flex items-center justify-center" />
    </div>
  );
};
