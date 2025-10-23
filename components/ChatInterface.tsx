import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AttachedFile } from '../types';
import { addTashkeelToText } from '../services/geminiService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RestoreIcon } from './icons/RestoreIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PrintIcon } from './icons/PrintIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';


// Declarations for libraries loaded via CDN
declare const mammoth: any;
declare const XLSX: any;
// Fix: Correctly declare SpeechRecognition and webkitSpeechRecognition on the Window interface for TypeScript.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, file: AttachedFile | null) => void;
  isLoading: boolean;
  onClear: () => void;
  onRestore: () => void;
  isHistoryCleared: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClear,
  onRestore,
  isHistoryCleared,
}) => {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const [audioLoadingIndex, setAudioLoadingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); // For SpeechRecognition

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'ar-JO';
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
        setInput(transcript);
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    // Cleanup speech synthesis on component unmount
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleTextToSpeech = async (text: string, index: number) => {
    if (speechSynthesis.speaking && speakingMessageIndex === index) {
      speechSynthesis.cancel();
      setSpeakingMessageIndex(null);
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setAudioLoadingIndex(index);
    setSpeakingMessageIndex(null);

    try {
      const voweledText = await addTashkeelToText(text);
      const cleanedText = voweledText.replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9\s.,؟?!،]/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'ar-SA';
      utterance.onend = () => setSpeakingMessageIndex(null);
      utterance.onerror = () => {
        console.error("An error occurred during speech synthesis.");
        setSpeakingMessageIndex(null);
      };

      speechSynthesis.speak(utterance);
      setSpeakingMessageIndex(index);
    } catch (error) {
       console.error("Failed to prepare audio:", error);
    } finally {
       setAudioLoadingIndex(null);
    }
  };
  
  const handleSend = () => {
    if (input.trim() || attachedFile) {
      onSendMessage(input.trim(), attachedFile);
      setInput('');
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile({ name: `جاري تحميل ${file.name}...`, content: '' });

    try {
        let textContent = '';
        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            textContent = result.value;
        } else if (file.name.endsWith('.xlsx')) {
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            textContent = XLSX.utils.sheet_to_csv(worksheet);
        } else {
             throw new Error("Unsupported file type.");
        }
        setAttachedFile({ name: file.name, content: textContent });
    } catch (error) {
        console.error("Error parsing file:", error);
        setAttachedFile({ name: `خطأ في قراءة ${file.name}`, content: '' });
        setTimeout(() => removeAttachedFile(), 3000);
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();
  
  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'أنت' : 'دعاء'}:\n${m.text}`).join('\n\n---\n\n');
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'محادثة-دعاء.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 p-4 overflow-y-auto printable-chat-area">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end mb-4 gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'model' && (
                <div className="w-6 h-6 self-center no-print">
                 {audioLoadingIndex === index ? (
                    <SpinnerIcon className="h-5 w-5 text-gold-500" />
                  ) : (
                    <button
                      onClick={() => handleTextToSpeech(message.text, index)}
                      className="text-gold-500 hover:text-gold-400"
                      aria-label={speakingMessageIndex === index ? 'إيقاف القراءة' : 'قراءة الرسالة'}
                      style={{ visibility: index === 0 ? 'hidden' : 'visible' }}
                    >
                      {speakingMessageIndex === index ? (
                        <StopCircleIcon className="h-5 w-5" />
                      ) : (
                        <SpeakerIcon className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              )}
              <div
                className={`max-w-2xl p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gold-600 text-white printable-message printable-message-user'
                    : 'bg-slate-800 text-gray-200 printable-message'
                }`}
              >
                <ReactMarkdown className="prose prose-invert prose-p:my-0 prose-pre:bg-slate-700 prose-pre:p-2 prose-pre:rounded">
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-2xl p-3 rounded-lg bg-slate-800 text-gray-200">
                <span className="animate-pulse">... جاري الكتابة</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 no-print">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-end items-center gap-2 mb-2">
                {isHistoryCleared ? (
                    <button onClick={onRestore} className="p-2 text-gold-500 hover:text-gold-400" title="استعادة المحادثة">
                        <RestoreIcon className="h-5 w-5" />
                    </button>
                ) : (
                    <button onClick={onClear} className="p-2 text-gold-500 hover:text-gold-400" title="مسح المحادثة">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
                 <button onClick={handleDownload} className="p-2 text-gold-500 hover:text-gold-400" title="تحميل المحادثة">
                    <DownloadIcon className="h-5 w-5" />
                </button>
                <button onClick={handlePrint} className="p-2 text-gold-500 hover:text-gold-400" title="طباعة المحادثة">
                    <PrintIcon className="h-5 w-5" />
                </button>
            </div>
            {attachedFile && (
                <div className="flex items-center bg-slate-700 p-2 rounded-md mb-2 text-sm">
                    <span className="truncate pr-2">{attachedFile.name}</span>
                    <button onClick={removeAttachedFile} className="mr-auto text-gray-400 hover:text-white flex-shrink-0">
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
          <div className="flex items-center bg-slate-700 rounded-lg p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا أو استخدم الميكروفون..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none px-2"
              rows={1}
            />
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".docx,.xlsx"
            />
            <button onClick={handleVoiceInput} className="p-2 text-gold-500 hover:text-gold-400" title="محادثة صوتية">
                <MicrophoneIcon className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
            </button>
            <button onClick={handleAttachClick} className="p-2 text-gold-500 hover:text-gold-400" title="إرفاق ملف">
                <PaperClipIcon className="h-6 w-6" />
            </button>
             <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachedFile)}
              className="p-2 text-gold-500 hover:text-gold-400 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;