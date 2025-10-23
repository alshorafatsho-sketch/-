
import React from 'react';
import type { Subject } from '../types';

interface SubjectPromptsProps {
  subjects: Subject[];
  onPromptClick: (prompt: string) => void;
}

const SubjectPrompts: React.FC<SubjectPromptsProps> = ({ subjects, onPromptClick }) => {
  if (subjects.length === 0) {
    return null;
  }

  return (
    <div className="p-2 no-print" dir="rtl">
        <div className="flex flex-wrap gap-2 justify-center">
            {subjects.map((subject) => (
                <button
                    key={subject.name}
                    onClick={() => onPromptClick(subject.prompt)}
                    className="px-3 py-1 text-sm bg-slate-700 text-gray-300 rounded-full hover:bg-slate-600 hover:text-gold-400 transition-colors"
                >
                    {subject.name}
                </button>
            ))}
        </div>
    </div>
  );
};

export default SubjectPrompts;
