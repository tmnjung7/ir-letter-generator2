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
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
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

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-7 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-sm shadow-sm">
            최근 분기별 실적 추이 <span className="text-[10px] font-normal opacity-70 ml-2">(단위: 억원, %)</span>
          </div>
          <div className="h-[280px] bg-gray-50/50 rounded-lg p-4">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={data.performanceHistory} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                 <YAxis yAxisId="left" hide />
                 <YAxis yAxisId="right" orientation="right" hide />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                 <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" barSize={40} radius={[4, 4, 0, 0]}>
                   <LabelList dataKey="revenue" position="top" style={{ fontSize: 10, fill: '#1e40af', fontWeight: 900 }} formatter={(v: number) => v.toLocaleString()} />
                 </Bar>
                 <Bar yAxisId="left" dataKey="operatingProfit" fill="#1e1b4b" barSize={30} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="operatingProfit" position="top" style={{ fontSize: 9, fill: '#1e1b4b', fontWeight: 700 }} />
                 </Bar>
                 <Line yAxisId="right" type="monotone" dataKey="profitRate" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}>
                   <LabelList dataKey="profitRate" position="top" offset={10} style={{ fontSize: 11, fill: '#b45309', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                 </Line>
               </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-sm shadow-sm">
            EARNINGS SUMMARY
          </div>
          <div className="p-6 bg-[#f8fafc] flex-1 rounded-sm border-t-4 border-[#002B5B] shadow-sm">
            <ul className="space-y-4 text-[14px] leading-[1.6]">
              {data.earningsSummary.map((line, idx) => (
                <li key={idx} className={`${line.startsWith('-') ? 'ml-4 text-gray-500 italic font-medium' : 'font-extrabold text-[#1e293b] border-l-4 border-[#002B5B] pl-3'}`}>
                   {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-4 border-[#002B5B] pb-2">
            <span className="text-3xl font-[900] italic tracking-tighter text-[#002B5B]">BUSINESS HIGHLIGHTS</span>
          </div>
          <div className="space-y-6">
            {data.businessHighlights.map((bh, idx) => (
              <div key={idx} className="bg-white p-6 border border-gray-100 shadow-md border-t-4 border-t-blue-600 rounded-sm">
                <div className="bg-[#5B718B] text-white px-3 py-1 italic font-black text-[10px] inline-block mb-3 rounded-sm uppercase tracking-wider">
                  {bh.title}
                </div>
                <div className="text-[#002B5B] font-black italic text-xl mb-3 border-b border-dashed border-gray-100 pb-2">
                  &ldquo; {bh.subtitle} &rdquo;
                </div>
                <ul className="space-y-2">
                  {bh.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-[12px] flex gap-2 items-start leading-[1.5] text-gray-700 font-medium">
                      <span className="text-blue-500 font-black mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-4 border-[#002B5B] pb-2 text-right">
            <span className="text-3xl font-[900] italic tracking-tighter text-[#002B5B]">KEY INDICATORS</span>
          </div>
          <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-lg">
             <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data.indicatorHistory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                     <XAxis dataKey="quarter" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 200]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                     <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 10, top: -10, fontWeight: 800 }} />
                     <Line type="monotone" dataKey="liquidityRatio" name="유동비율" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                     <Line type="monotone" dataKey="debtRatio" name="부채비율" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                     <Line type="monotone" dataKey="equityRatio" name="자기자본" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="mt-2 flex flex-col gap-4">
            <div className="border-b-4 border-[#002B5B] pb-2 text-right font-black italic text-3xl text-[#002B5B]">KCC IR INFO</div>
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-[#1e1b4b] text-white p-4 rounded-sm flex items-center gap-6 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-blue-400 shrink-0" />
                  <div className="text-[12px] font-bold grid grid-cols-2 w-full gap-2">
                    {data.irSupport.map((line, idx) => <div key={idx} className="opacity-90">{line}</div>)}
                  </div>
               </div>
               <div className="bg-[#002B5B] text-white p-4 rounded-sm flex items-center gap-6 shadow-sm">
                  <Briefcase className="w-8 h-8 text-blue-400 shrink-0" />
                  <div className="text-[11px] font-bold leading-tight">
                    {data.irAction.slice(0, 3).map((line, idx) => <div key={idx} className="mb-1">• {line}</div>)}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t-[8px] border-[#002B5B] flex justify-between items-center text-[#002B5B] font-black">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-800" />
          <span className="text-xl tracking-tighter">kccworld.irpage.co.kr</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-blue-800" />
          <span className="text-xl tracking-tighter">02-3480-5000</span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
