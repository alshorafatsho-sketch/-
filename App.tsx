import React, { useState, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, TawjihiStream, AttachedFile, Subject } from './types';
import { startChat } from './services/geminiService';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import { tawjihiStreams } from './data';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [deletedHistory, setDeletedHistory] = useState<ChatMessage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<TawjihiStream>(tawjihiStreams[0].id);
  const [selectedSubjectDisplayName, setSelectedSubjectDisplayName] = useState<string | null>(null);

  const getWelcomeMessage = (streamId: TawjihiStream) => {
    const streamName = tawjihiStreams.find(s => s.id === streamId)?.name || 'التوجيهي';
    return `أهلاً بك في ${streamName}! أنا "دعاء"، مساعدك الدراسي الذكي. اختر مادة من القائمة أعلاه أو اسألني مباشرة. يمكنك أيضاً إرفاق ملف Word أو Excel لطرح أسئلة حوله.`;
  };

  const initializeChat = () => {
    const newChat = startChat();
    setChat(newChat);
    setChatHistory([
      {
        role: 'model',
        text: getWelcomeMessage(tawjihiStreams[0].id),
      },
    ]);
     setDeletedHistory(null);
  };

  useEffect(() => {
    initializeChat();
  }, []);
  
  // Update welcome message when stream changes
  useEffect(() => {
    setChatHistory(prev => {
      if (prev.length === 0) return [];
      const newHistory = [...prev];
      newHistory[0] = { ...newHistory[0], text: getWelcomeMessage(selectedStream) };
      return newHistory;
    });
    setSelectedSubjectDisplayName(null); // Reset subject when stream changes
  }, [selectedStream]);

  const handleSendMessage = async (message: string, file: AttachedFile | null) => {
    if (!chat) return;

    setIsLoading(true);
    setError(null);
    setDeletedHistory(null);

    const streamName = tawjihiStreams.find(s => s.id === selectedStream)?.name || '';
    const subjectContext = selectedSubjectDisplayName ? ` عن مادة ${selectedSubjectDisplayName}` : '';
    
    // Message for API
    let userMessageForApi = `(سؤالي ضمن ${streamName}${subjectContext}) ${message}`;
     if (file) {
        userMessageForApi = `استنادًا إلى محتوى الملف المرفق (${streamName}${subjectContext})، أجب عن السؤال التالي.\n\nاسم الملف: ${file.name}\nمحتوى الملف:\n---\n${file.content}\n---\n\nالسؤال: ${message}`;
    }

    // Message for UI History
    const userMessageForHistory = file
        ? `${message}\n(ملف مرفق: ${file.name})`
        : message;

    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: userMessageForHistory }];
    setChatHistory(updatedHistory);

    try {
      const stream = await chat.sendMessageStream({ message: userMessageForApi });
      
      let modelResponse = '';
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'model', text: modelResponse };
          return newHistory;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong. Please try again. Error: ${errorMessage}`);
      setChatHistory(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    setDeletedHistory(chatHistory);
    setChatHistory(prev => [prev[0]]);
  }

  const handleRestoreChat = () => {
    if(deletedHistory){
        setChatHistory(deletedHistory);
        setDeletedHistory(null);
    }
  }
  
  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubjectDisplayName(subject.name);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-100">
      <Header 
        selectedStream={selectedStream} 
        onStreamChange={setSelectedStream} 
        onSubjectSelect={handleSubjectSelect}
        selectedSubjectDisplayName={selectedSubjectDisplayName}
      />
      <main className="flex-1 overflow-hidden">
        <ChatInterface
          messages={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClear={handleClearChat}
          onRestore={handleRestoreChat}
          isHistoryCleared={!!deletedHistory}
        />
      </main>
      {error && <div className="p-4 bg-red-500 text-white text-center no-print">{error}</div>}
    </div>
  );
};

export default App;