
import React, { useState } from 'react';
import { INITIAL_STATE_KOR } from './constants';
import { IRLetterState } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { FileDown, LayoutDashboard, Settings, Languages, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<IRLetterState>(INITIAL_STATE_KOR);
  const [lang, setLang] = useState<'KOR' | 'ENG'>('KOR');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleUpdateData = <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const translateToEnglish = async () => {
    if (lang === 'ENG') return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following IR Letter JSON data from Korean to English. 
        Maintain professional financial and Investor Relations terminology. 
        Keep the structure of 'performanceHistory' and 'indicatorHistory' intact.
        Return ONLY the raw JSON object.
        Data: ${JSON.stringify(data)}`,
        config: {
          responseMimeType: "application/json",
        },
      });
      
      const translatedData = JSON.parse(response.text || '{}');
      setData(translatedData);
      setLang('ENG');
    } catch (error) {
      console.error("AI Translation Error:", error);
      alert("AI 번역 중 오류가 발생했습니다. API 키 설정을 확인하거나 잠시 후 다시 시도해주세요.");
    } finally {
      setIsTranslating(false);
    }
  };

  const switchToKorean = () => {
    if (lang === 'KOR') return;
    setLang('KOR');
    // 실제 운영에서는 캐싱된 국문 데이터를 불러오거나 초기 상태로 복구할 수 있습니다.
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#002B5B] text-white p-4 shadow-xl flex items-center justify-between no-print sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter">(주)KCC IR LETTER</h1>
          </div>
          
          <div className="flex bg-white/10 rounded-xl p-1 border border-white/20 shadow-inner">
            <button 
              onClick={switchToKorean}
              className={`px-6 py-2 rounded-lg text-sm font-black transition-all duration-200 ${lang === 'KOR' ? 'bg-white text-[#002B5B] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70'}`}
            >
              KOR
            </button>
            <button 
              onClick={translateToEnglish}
              disabled={isTranslating}
              className={`px-6 py-2 rounded-lg text-sm font-black transition-all duration-200 flex items-center gap-2 ${lang === 'ENG' ? 'bg-white text-[#002B5B] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70 opacity-80'}`}
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
              ENG (AI Auto)
            </button>
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white transition-all transform hover:scale-105 px-6 py-2.5 rounded-xl font-black text-sm shadow-xl active:scale-95"
        >
          <FileDown className="w-4 h-4" />
          PDF 다운로드 / 인쇄
        </button>
      </header>

      {/* Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor (Left) */}
        <div className="w-1/3 min-w-[420px] border-r bg-white overflow-y-auto no-print shadow-2xl z-10">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-black text-gray-800 tracking-tight">콘텐츠 편집기 ({lang})</h2>
            </div>
            {isTranslating ? (
              <div className="flex flex-col items-center justify-center py-40 text-gray-400 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <div className="text-center">
                  <p className="text-lg font-black text-gray-700">Gemini AI 번역 중...</p>
                  <p className="text-sm">전문 금융 용어로 최적화하고 있습니다.</p>
                </div>
              </div>
            ) : (
              <Editor data={data} onUpdate={handleUpdateData} />
            )}
          </div>
        </div>

        {/* Preview (Right) */}
        <div className="flex-1 bg-gray-200 overflow-y-auto flex justify-center p-12 print-area scroll-smooth">
          <div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white relative origin-top scale-95 lg:scale-100 transition-all duration-500 rounded-sm">
             <Preview data={data} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-3 text-center text-[10px] font-bold text-gray-400 no-print">
        &copy; 2025 (주)KCC Investor Relations System - Interactive Letter Generator v1.0
      </footer>
    </div>
  );
};

export default App;
