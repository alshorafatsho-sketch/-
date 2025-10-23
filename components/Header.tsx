import React from 'react';
import type { TawjihiStream, Subject } from '../types';
import StreamSelector from './StreamSelector';
import SubjectSelector from './SubjectSelector';
import CommonSubjectsSelector from './CommonSubjectsSelector';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface HeaderProps {
  selectedStream: TawjihiStream;
  onStreamChange: (stream: TawjihiStream) => void;
  onSubjectSelect: (subject: Subject) => void;
  selectedSubjectDisplayName: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedStream, onStreamChange, onSubjectSelect, selectedSubjectDisplayName }) => {
  return (
    <header className="bg-slate-800 shadow-md p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse border-b-2 border-gold-500 no-print">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <BookOpenIcon className="h-10 w-10 text-gold-500" />
        <div>
          <h1 className="text-2xl font-bold text-gold-400">
            دعاء للتوجيهي الأردني
          </h1>
          <p className="text-sm text-gray-400">
            مساعدك الدراسي الذكي لنجاحك في التوجيهي
          </p>
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-center gap-2">
        <CommonSubjectsSelector onSubjectSelect={onSubjectSelect} selectedSubjectDisplayName={selectedSubjectDisplayName} />
        <SubjectSelector selectedStream={selectedStream} onSubjectSelect={onSubjectSelect} selectedSubjectDisplayName={selectedSubjectDisplayName} />
        <StreamSelector selectedStream={selectedStream} onStreamChange={onStreamChange} />
      </div>
    </header>
  );
};

export default Header;