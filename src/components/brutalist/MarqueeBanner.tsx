'use client';

import React from 'react';

export function MarqueeBanner() {
  const items = [
    'STUDIO SON',
    'PODCAST',
    'SHOOTING',
    'CLIPS',
    'BEATS',
    'MIX & MASTER',
    'THIÈS',
  ];

  return (
    <div className="relative w-full overflow-hidden py-3 bg-[#f1eadd] select-none my-6">
      <div
        className="w-[110%] -ml-[5%] bg-[#d7261e] border-y-[1.5px] border-[#121110] py-3.5 transform -rotate-[1.4deg] shadow-md flex items-center overflow-hidden"
      >
        <div
          className="flex whitespace-nowrap gap-6 animate-marquee"
          style={{
            animation: 'marquee 30s linear infinite',
          }}
        >
          {Array.from({ length: 4 }).map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <span className="font-anton text-2xl sm:text-3xl uppercase tracking-wider text-white">
                    {item}
                  </span>
                  <span className="text-[#121110] text-sm">◆</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
