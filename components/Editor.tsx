
import React from 'react';
import { IRLetterState, BusinessHighlight, PerformanceData, IndicatorData } from '../types';
import { ChevronRight } from 'lucide-react';

interface EditorProps {
  data: IRLetterState;
  onUpdate: <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
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
        {sectionHeader("사업별 주요 성과")}
        {data.businessHighlights.map((highlight, idx) => (
          <div key={idx} className="p-6 border-2 border-gray-100 rounded-2xl bg-white mb-4 space-y-4">
            <input className="w-full font-black text-base border-b py-1" value={highlight.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} />
            <input className="w-full italic text-sm text-gray-600 bg-gray-50 p-2 rounded" value={highlight.subtitle} onChange={e => updateHighlight(idx, 'subtitle', e.target.value)} />
            <textarea className="w-full text-xs border rounded p-3 min-h-[80px]" value={highlight.details.join('\n')} onChange={e => updateHighlight(idx, 'details', e.target.value.split('\n'))} />
          </div>
        ))}
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
