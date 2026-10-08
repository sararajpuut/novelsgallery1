import React, { useEffect, useRef } from 'react';

export type AdsterraBannerType = 
  | '728x90' 
  | '468x60' 
  | '300x250' 
  | '160x300' 
  | '160x600' 
  | '320x50';

interface BannerConfig {
  key: string;
  width: number;
  height: number;
  label: string;
}

export const ADSTERRA_CONFIGS: Record<AdsterraBannerType, BannerConfig> = {
  '728x90': {
    key: '960f3ed65dc159b66609c626351501f7',
    width: 728,
    height: 90,
    label: 'Leaderboard Banner',
  },
  '468x60': {
    key: '0ea2bef70d3e24e131d1fb87071e744b',
    width: 468,
    height: 60,
    label: 'Banner 468x60',
  },
  '300x250': {
    key: '160245628fd094e1824f4c8fbd2ea6c1',
    width: 300,
    height: 250,
    label: 'Medium Rectangle 300x250',
  },
  '160x300': {
    key: '96a0555f27a506e72fa0e01eed9d3b2c',
    width: 160,
    height: 300,
    label: 'Skyscraper 160x300',
  },
  '160x600': {
    key: '70e79d2164ca21d76ea49c69718689e2',
    width: 160,
    height: 600,
    label: 'Wide Skyscraper 160x600',
  },
  '320x50': {
    key: '7070811fee90a978f95c889ad1269ad5',
    width: 320,
    height: 50,
    label: 'Mobile Banner 320x50',
  },
};

interface AdsterraBannerProps {
  type: AdsterraBannerType;
  className?: string;
  hideLabel?: boolean;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ 
  type, 
  className = '',
  hideLabel = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = ADSTERRA_CONFIGS[type];

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any previous iframe to prevent duplicates on re-render
    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = `${config.width}`;
    iframe.height = `${config.height}`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.scrolling = 'no';
    iframe.setAttribute('title', `Adsterra ${config.label}`);

    containerRef.current.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  background: transparent;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${config.key}',
                  'format' : 'iframe',
                  'height' : ${config.height},
                  'width' : ${config.width},
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://bicea.org/22/${config.key}"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch {
      // In sandboxed environments if iframe doc writing is restricted, fallback quietly
    }
  }, [type, config.key, config.width, config.height, config.label]);

  return (
    <div className={`flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
      {!hideLabel && (
        <span className="text-[10px] tracking-wider text-[#6B6B6B]/60 uppercase font-medium mb-1">
          Advertisement · اسپانسرڈ
        </span>
      )}
      <div 
        ref={containerRef} 
        style={{ width: `${config.width}px`, minHeight: `${config.height}px` }}
        className="flex items-center justify-center bg-[#EEE8D8]/20 rounded border border-[#173F35]/10 overflow-hidden shadow-2xs"
      />
    </div>
  );
};
