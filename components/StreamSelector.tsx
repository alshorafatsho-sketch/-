import React, { useState } from 'react';
import type { TawjihiStream } from '../types';
import { tawjihiStreams } from '../data';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface StreamSelectorProps {
  selectedStream: TawjihiStream;
  onStreamChange: (stream: TawjihiStream) => void;
}

const StreamSelector: React.FC<StreamSelectorProps> = ({ selectedStream, onStreamChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStreamName = tawjihiStreams.find(s => s.id === selectedStream)?.name;

  return (
    <div className="relative inline-block text-left no-print">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gold-600 shadow-sm px-4 py-2 bg-gold-500 text-sm font-bold text-slate-900 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-gold-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedStreamName}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-center absolute mt-2 w-56 rounded-md shadow-lg bg-slate-700 ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          dir='rtl'
        >
          <div className="py-1" role="none">
            {tawjihiStreams.map((stream) => (
              <a
                href="#"
                key={stream.id}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-slate-600 hover:text-gold-400"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  onStreamChange(stream.id);
                  setIsOpen(false);
                }}
              >
                {stream.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamSelector;