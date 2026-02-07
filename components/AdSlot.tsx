
import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  type: 'header' | 'sidebar' | 'in-article' | 'footer' | 'mobile';
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ type, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const adConfig = {
      header: { key: 'fb3cb3971b57c0dd5c940a075d05ac82', format: 'iframe', height: 90, width: 728 },
      footer: { key: 'fb3cb3971b57c0dd5c940a075d05ac82', format: 'iframe', height: 90, width: 728 },
      sidebar: { key: 'a3693e3e9aa3605200991115621cab97', format: 'iframe', height: 250, width: 300 },
      'in-article': { key: 'a3693e3e9aa3605200991115621cab97', format: 'iframe', height: 250, width: 300 },
      mobile: { key: 'fac367d7635ad8c9a96c3c389fc09c0c', format: 'iframe', height: 60, width: 468 },
    };

    const config = adConfig[type];

    adRef.current.innerHTML = '';
    
    // Create the script element to hold atOptions
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${config.key}',
        'format' : '${config.format}',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : {}
      };
    `;
    
    // Create the invoke script element
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
    invokeScript.async = true;

    // Append to container
    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(invokeScript);

    return () => {
      if (adRef.current) adRef.current.innerHTML = '';
    };
  }, [type]);

  const dimensions = {
    header: "w-full min-h-[100px] flex items-center justify-center",
    sidebar: "w-full min-h-[260px] flex items-center justify-center",
    "in-article": "w-full min-h-[260px] my-8 flex items-center justify-center",
    footer: "w-full min-h-[100px] flex items-center justify-center",
    mobile: "w-full min-h-[70px] flex items-center justify-center"
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -top-4 left-0 w-full flex justify-center">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white dark:bg-gray-900 px-2">Publicity</span>
      </div>
      <div 
        ref={adRef}
        className={`${dimensions[type]} border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 transition-all duration-300 overflow-hidden`}
      />
    </div>
  );
};

export default AdSlot;
