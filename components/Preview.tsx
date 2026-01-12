
import React from 'react';
import { IRLetterState } from '../types';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Line, ComposedChart, LabelList, Legend, LineChart
} from 'recharts';
import { Phone, Globe, MessageSquare, Briefcase } from 'lucide-react';

interface PreviewProps {
  data: IRLetterState;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  return (
    <div className="w-[800px] bg-white p-12 border border-gray-100 shadow-sm font-sans flex flex-col gap-10 select-none cursor-default print-area" style={{ minHeight: '1131px' }}>
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[#002B5B] text-base font-black uppercase tracking-[0.2em]">{data.date}</span>
          <h1 className="text-[#002B5B] text-[84px] font-[900] italic tracking-[-0.08em] leading-[0.85] mt-3">IR LETTER</h1>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="p-1 px-4 border-l-8 border-[#002B5B]">
              <div className="text-4xl font-black text-[#002B5B] tracking-tighter leading-none">(주) KCC</div>
           </div>
           <div className="text-4xl font-black text-gray-800 mt-2 tracking-tight">{data.quarterTitle}</div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-10">
        
        {/* Performance Chart Section */}
        <div className="col-span-7 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-r-lg shadow-md uppercase tracking-tight">
            최근 분기별 실적 추이 <span className="text-[10px] font-normal opacity-70 ml-2">(단위: 억원, %)</span>
          </div>
          <div className="h-[280px] relative">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={data.performanceHistory} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                 <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#1e293b' }} />
                 <YAxis yAxisId="left" hide />
                 <YAxis yAxisId="right" orientation="right" hide />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                 <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" barSize={42} radius={[4, 4, 0, 0]}>
                   <LabelList dataKey="revenue" position="top" style={{ fontSize: 11, fill: '#475569', fontWeight: 900 }} formatter={(v: number) => v.toLocaleString()} />
                 </Bar>
                 <Line yAxisId="right" type="monotone" dataKey="profitRate" stroke="#F59E0B" strokeWidth={4} dot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }}>
                   <LabelList dataKey="profitRate" position="top" offset={15} style={{ fontSize: 12, fill: '#000', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                 </Line>
                 <Bar yAxisId="left" dataKey="operatingProfit" fill="#1e1b4b" barSize={36} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="operatingProfit" position="top" style={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                 </Bar>
               </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Section */}
        <div className="col-span-5 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-r-lg shadow-md uppercase tracking-tight">
            EARNINGS SUMMARY
          </div>
          <div className="p-6 bg-[#f8fafc] flex-1 rounded-sm border-t-4 border-[#002B5B] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]">
            <ul className="space-y-5 text-[15px] leading-[1.6]">
              {data.earningsSummary.map((line, idx) => (
                <li key={idx} className={`${line.startsWith('-') ? 'ml-5 text-gray-500 italic font-medium' : 'font-black text-black border-l-4 border-[#002B5B] pl-4'}`}>
                   {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Business Highlights */}
        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-[6px] border-[#002B5B] pb-3">
            <span className="text-4xl font-[900] italic tracking-tighter text-[#002B5B] leading-none">BUSINESS HIGHLIGHTS</span>
          </div>
          <div className="space-y-6">
            {data.businessHighlights.map((bh, idx) => (
              <div key={idx} className="bg-white p-6 border border-gray-100 shadow-lg rounded-sm hover:shadow-xl transition-shadow border-t-4 border-t-blue-500">
                <div className="bg-[#5B718B] text-white px-4 py-1.5 italic font-black text-xs inline-block mb-4 rounded-sm tracking-wider shadow-sm">
                  {bh.title}
                </div>
                <div className="text-[#002B5B] font-black italic text-2xl mb-4 text-center block w-full border-b border-dashed border-gray-200 pb-3 leading-tight">
                  &ldquo; {bh.subtitle} &rdquo;
                </div>
                <ul className="space-y-2.5">
                  {bh.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-[13px] flex gap-3 items-start leading-[1.5] text-gray-800 font-medium">
                      <span className="text-blue-600 font-black mt-1 text-base">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators Section */}
        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-[6px] border-[#002B5B] pb-3 text-right">
            <span className="text-4xl font-[900] italic tracking-tighter text-[#002B5B] leading-none">KEY INDICATORS</span>
          </div>
          <div className="p-4 bg-[#fdfdfd] border border-gray-50 rounded-lg">
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data.indicatorHistory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="quarter" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 200]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 11, top: -10, fontWeight: 900 }} />
                     <Line type="monotone" dataKey="liquidityRatio" name="유동비율" stroke="#3B82F6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}>
                        <LabelList dataKey="liquidityRatio" position="top" style={{ fontSize: 10, fill: '#1d4ed8', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                     </Line>
                     <Line type="monotone" dataKey="equityRatio" name="자기자본비율" stroke="#EF4444" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}>
                        <LabelList dataKey="equityRatio" position="bottom" style={{ fontSize: 10, fill: '#b91c1c', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                     </Line>
                     <Line type="monotone" dataKey="dependencyRatio" name="차입금의존도" stroke="#10B981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}>
                        <LabelList dataKey="dependencyRatio" position="right" style={{ fontSize: 10, fill: '#047857', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                     </Line>
                     <Line type="monotone" dataKey="debtRatio" name="부채비율" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}>
                        <LabelList dataKey="debtRatio" position="top" style={{ fontSize: 10, fill: '#6d28d9', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                     </Line>
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[11px] text-gray-400 mt-4 text-right font-bold italic tracking-tight italic">주) 재무정보는 제67기 사업보고서 공시 기준이며, 경영환경에 따라 변동될 수 있습니다.</p>
          </div>

          {/* IR Contacts Section */}
          <div className="mt-4 flex flex-col gap-5">
            <div className="border-b-[6px] border-[#002B5B] pb-3 text-right">
              <span className="text-4xl font-[900] italic tracking-tighter text-[#002B5B] uppercase leading-none">KCC INVESTOR RELATIONS</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-2">
               {/* Support Card */}
               <div className="bg-[#1e1b4b] text-white flex min-h-[170px] rounded-lg overflow-hidden shadow-xl transform transition-transform hover:-translate-y-1">
                  <div className="w-[30%] flex flex-col items-center justify-center border-r border-white/10 p-2 text-center bg-white/5">
                    <div className="p-4 bg-white/10 rounded-full mb-3 shadow-inner">
                      <MessageSquare className="w-9 h-9" />
                    </div>
                    <span className="text-[12px] font-black italic tracking-widest text-blue-300">SUPPORT</span>
                  </div>
                  <div className="w-[70%] p-5 flex flex-col justify-center gap-3">
                    {data.irSupport.map((line, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <span className="text-blue-400 text-[12px] mt-1">▶</span>
                        <span className="text-[12px] leading-tight font-black opacity-100 tracking-tighter">{line}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Action Card */}
               <div className="bg-[#002B5B] text-white flex min-h-[170px] rounded-lg overflow-hidden shadow-xl transform transition-transform hover:-translate-y-1">
                  <div className="w-[30%] flex flex-col items-center justify-center border-r border-white/10 p-2 text-center bg-white/5">
                    <div className="p-4 bg-white/10 rounded-full mb-3 shadow-inner">
                      <Briefcase className="w-9 h-9" />
                    </div>
                    <span className="text-[12px] font-black italic tracking-widest text-blue-300">ACTION</span>
                  </div>
                  <div className="w-[70%] p-5 flex flex-col justify-center gap-2">
                    {data.irAction.slice(0, 8).map((line, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <span className={`text-blue-300 text-[11px] mt-1 ${line.startsWith('-') ? 'hidden' : ''}`}>•</span>
                        <span className={`text-[11px] leading-tight font-black opacity-100 tracking-tighter ${line.startsWith('-') ? 'ml-4 opacity-80 font-bold italic' : ''}`}>
                          {line.includes('(') ? <span className="underline decoration-blue-400/50 underline-offset-4">{line}</span> : line}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto pt-10 border-t-[10px] border-[#002B5B] flex justify-between items-center text-[#002B5B] font-black">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
            <Globe className="w-7 h-7 text-blue-700" />
          </div>
          <span className="text-2xl tracking-tighter group-hover:underline transition-all">kccworld.irpage.co.kr</span>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
            <Phone className="w-7 h-7 text-blue-700" />
          </div>
          <span className="text-2xl tracking-tighter group-hover:scale-105 transition-all">02-3480-5000 (press "5")</span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
