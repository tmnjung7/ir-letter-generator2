import React, { useState } from 'react';
import { IRLetterState, BusinessHighlight, PerformanceData, IndicatorData } from '../types';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface EditorProps {
  data: IRLetterState;
  onUpdate: <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [keywords, setKeywords] = useState({ 건재: '', 도료: '', 실리콘: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState<BusinessHighlight | null>(null);

  const updateHighlight = (index: number, field: keyof BusinessHighlight, value: string | string[]) => {
    const newHighlights = [...data.businessHighlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    onUpdate('businessHighlights', newHighlights);
  };

  const updatePerformance = (index: number, field: keyof PerformanceData, value: string | number) => {
    const newData = [...data.performanceHistory];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate('performanceHistory', newData);
  };

  const updateIndicator = (index: number, field: keyof IndicatorData, value: string | number) => {
    const newData = [...data.indicatorHistory];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate('indicatorHistory', newData);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiDraft(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
      다음은 KCC의 3개 사업부(건재, 도료, 실리콘)에 대한 주요 키워드/실적 데이터입니다.
      이 키워드들을 바탕으로 IR (Investor Relations) 레터에 들어갈 '사업별 주요 성과' 문구를 전문적이고 깔끔하게 작성해주세요.
      각 사업부별로 1~2줄의 명확하고 신뢰감 있는 문장으로 정리해주세요.
      
      [키워드]
      - 건재사업부: ${keywords.건재 || '전방산업 침체 속 수익성 방어'}
      - 도료사업부: ${keywords.도료 || '자동차/선박 중심 매출 유지'}
      - 실리콘사업부: ${keywords.실리콘 || '공장 효율화 및 비용 절감'}
      
      반드시 아래 JSON 형식으로만 응답해주세요:
      {
        "title": "${data.quarterTitle.replace('년 ', '년 ').replace('분기', '분기 실적')}",
        "subtitle": "계절적·일회성 요인 제외 시 견조한 흐름",
        "details": [
          "(건재사업부) ...",
          "(도료사업부) ...",
          "(실리콘사업부) ..."
        ]
      }
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text;
      if (!responseText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      const result = JSON.parse(responseText);
      setAiDraft({
        title: result.title || "3분기 실적",
        subtitle: result.subtitle || "계절적·일회성 요인 제외 시 견조한 흐름",
        details: result.details || []
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("AI 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyDraft = () => {
    if (!aiDraft) return;
    const newHighlights = [...data.businessHighlights];
    if (newHighlights.length > 0) {
      newHighlights[0] = { 
        ...newHighlights[0], 
        title: aiDraft.title,
        subtitle: aiDraft.subtitle,
        details: aiDraft.details
      };
    } else {
      newHighlights.push(aiDraft);
    }
    onUpdate('businessHighlights', newHighlights);
    setAiDraft(null);
    setShowAIGenerator(false);
    setKeywords({ 건재: '', 도료: '', 실리콘: '' });
  };

  const sectionHeader = (title: string) => (
    <h3 className="font-black text-[#002B5B] text-lg flex items-center gap-2 mb-4">
      <div className="w-1.5 h-6 bg-[#002B5B] rounded-full"></div>
      {title}
    </h3>
  );

  return (
    <div className="space-y-12 pb-20">
      <section>
        {sectionHeader("기본 정보")}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">발행 일자</label>
            <input className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium" value={data.date} onChange={e => onUpdate('date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">분기 제목</label>
            <input className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium" value={data.quarterTitle} onChange={e => onUpdate('quarterTitle', e.target.value)} />
          </div>
        </div>
      </section>

      <section>
        {sectionHeader("실적 요약 (Earnings Summary)")}
        <textarea 
          className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[160px] leading-relaxed font-medium" 
          value={data.earningsSummary.join('\n')} 
          onChange={e => onUpdate('earningsSummary', e.target.value.split('\n'))}
        />
      </section>

      <section>
        {sectionHeader("분기별 실적 데이터")}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-3 max-h-[300px] overflow-y-auto border-2 border-gray-100">
          <div className="grid grid-cols-4 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center px-2">
            <div>분기</div>
            <div>매출액</div>
            <div>영업이익</div>
            <div>이익률(%)</div>
          </div>
          {data.performanceHistory.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
              <input className="border text-xs p-1 rounded font-bold" value={item.quarter} onChange={e => updatePerformance(idx, 'quarter', e.target.value)} />
              <input type="number" className="border text-xs p-1 rounded text-center" value={item.revenue} onChange={e => updatePerformance(idx, 'revenue', Number(e.target.value))} />
              <input type="number" className="border text-xs p-1 rounded text-center" value={item.operatingProfit} onChange={e => updatePerformance(idx, 'operatingProfit', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.profitRate} onChange={e => updatePerformance(idx, 'profitRate', Number(e.target.value))} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          {sectionHeader("사업별 주요 성과")}
          <button
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 성과 자동 작성
          </button>
        </div>

        {showAIGenerator && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
            <h4 className="text-sm font-black text-[#002B5B] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              사업부별 키워드 입력
            </h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">건재사업부</label>
                <input 
                  className="w-full border border-blue-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="예: 전방산업 침체, 수익성 방어 노력"
                  value={keywords.건재}
                  onChange={e => setKeywords({...keywords, 건재: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">도료사업부</label>
                <input 
                  className="w-full border border-blue-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="예: 자동차/선박 매출 유지, 고부가가치 제품 확대"
                  value={keywords.도료}
                  onChange={e => setKeywords({...keywords, 도료: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">실리콘사업부</label>
                <input 
                  className="w-full border border-blue-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="예: 공장 효율화, 비용 절감, 수익성 개선 기반"
                  value={keywords.실리콘}
                  onChange={e => setKeywords({...keywords, 실리콘: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setShowAIGenerator(false);
                  setAiDraft(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-[#002B5B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isGenerating ? '생성 중...' : 'AI 생성하기'}
              </button>
            </div>

            {aiDraft && (
              <div className="mt-6 pt-6 border-t border-blue-200">
                <h5 className="text-xs font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  AI 생성 초안 미리보기
                </h5>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3">
                  <div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{aiDraft.title}</div>
                    <div className="text-sm font-extrabold text-slate-900">{aiDraft.subtitle}</div>
                  </div>
                  <ul className="space-y-1.5">
                    {aiDraft.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-medium flex gap-2">
                        <span className="text-blue-400 font-bold shrink-0">·</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={applyDraft}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    이 초안으로 적용하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {data.businessHighlights.map((highlight, idx) => (
          <div key={idx} className="p-6 border-2 border-gray-100 rounded-2xl bg-white mb-4 space-y-4">
            <input className="w-full font-black text-base border-b py-1" value={highlight.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} />
            <input className="w-full italic text-sm text-gray-600 bg-gray-50 p-2 rounded" value={highlight.subtitle} onChange={e => updateHighlight(idx, 'subtitle', e.target.value)} />
            <textarea className="w-full text-xs border rounded p-3 min-h-[80px]" value={highlight.details.join('\n')} onChange={e => updateHighlight(idx, 'details', e.target.value.split('\n'))} />
          </div>
        ))}
      </section>

      <section>
        {sectionHeader("재무 건전성 지표 (Key Indicators)")}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-3 max-h-[300px] overflow-y-auto border-2 border-gray-100">
          <div className="grid grid-cols-5 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center px-2">
            <div>분기</div>
            <div>유동비율(%)</div>
            <div>자기자본(%)</div>
            <div>의존도(%)</div>
            <div>부채비율(%)</div>
          </div>
          {data.indicatorHistory.map((item, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
              <input className="border text-xs p-1 rounded font-bold text-center" value={item.quarter} onChange={e => updateIndicator(idx, 'quarter', e.target.value)} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.liquidityRatio} onChange={e => updateIndicator(idx, 'liquidityRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.equityRatio} onChange={e => updateIndicator(idx, 'equityRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.dependencyRatio} onChange={e => updateIndicator(idx, 'dependencyRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.debtRatio} onChange={e => updateIndicator(idx, 'debtRatio', Number(e.target.value))} />
            </div>
          ))}
        </div>
      </section>

      <section>
        {sectionHeader("IR 활동 및 지원")}
        <div className="space-y-4">
          <textarea 
            className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[100px]" 
            value={data.irSupport.join('\n')} 
            onChange={e => onUpdate('irSupport', e.target.value.split('\n'))}
          />
          <textarea 
            className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[150px]" 
            value={data.irAction.join('\n')} 
            onChange={e => onUpdate('irAction', e.target.value.split('\n'))}
          />
        </div>
      </section>
    </div>
  );
};

export default Editor;
