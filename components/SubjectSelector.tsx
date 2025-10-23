import React, { useState } from 'react';
import type { TawjihiStream, Subject } from '../types';
import { subjectsByStream } from '../data';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

interface SubjectSelectorProps {
  selectedStream: TawjihiStream;
  onSubjectSelect: (subject: Subject) => void;
  selectedSubjectDisplayName: string | null;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selectedStream, onSubjectSelect, selectedSubjectDisplayName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const subjects = subjectsByStream[selectedStream] || [];
  
  const isSelected = subjects.some(s => s.name === selectedSubjectDisplayName);
  const buttonText = isSelected ? selectedSubjectDisplayName : 'اختر المادة';

  return (
    <div className="relative inline-block text-left no-print">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gold-600 shadow-sm px-4 py-2 bg-gold-500 text-sm font-bold text-slate-900 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-gold-500"
          id="subjects-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AcademicCapIcon className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2" />
          {buttonText}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 rtl:-ml-1 rtl:mr-2" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-center absolute mt-2 w-56 max-h-80 overflow-y-auto rounded-md shadow-lg bg-slate-700 ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="subjects-menu"
          dir='rtl'
        >
          <div className="py-1" role="none">
            {subjects.map((subject) => (
              <a
                href="#"
                key={subject.name}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-slate-600 hover:text-gold-400"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  onSubjectSelect(subject);
                  setIsOpen(false);
                }}
              >
                {subject.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;