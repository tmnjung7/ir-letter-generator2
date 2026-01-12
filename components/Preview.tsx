
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

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-7 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-r-lg shadow-md">
            최근 분기별 실적 추이 <span className="text-[10px] font-normal opacity-70 ml-2">(단위: 억원, %)</span>
          </div>
          <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={data.performanceHistory} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                 <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#1e293b' }} />
                 <YAxis yAxisId="left" hide />
                 <YAxis yAxisId="right" orientation="right" hide />
                 <Tooltip />
                 <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" barSize={42} radius={[4, 4, 0, 0]}>
                   <LabelList dataKey="revenue" position="top" style={{ fontSize: 11, fill: '#475569', fontWeight: 900 }} formatter={(v: number) => v.toLocaleString()} />
                 </Bar>
                 <Line yAxisId="right" type="monotone" dataKey="profitRate" stroke="#F59E0B" strokeWidth={4} dot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}>
                   <LabelList dataKey="profitRate" position="top" offset={15} style={{ fontSize: 12, fill: '#000', fontWeight: 900 }} formatter={(v: number) => `${v}%`} />
                 </Line>
                 <Bar yAxisId="left" dataKey="operatingProfit" fill="#1e1b4b" barSize={36} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="operatingProfit" position="top" style={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                 </Bar>
               </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-5">
          <div className="bg-[#002B5B] text-white px-6 py-2.5 font-black text-lg inline-block self-start rounded-r-lg shadow-md">
            EARNINGS SUMMARY
          </div>
          <div className="p-6 bg-[#f8fafc] flex-1 rounded-sm border-t-4 border-[#002B5B]">
            <ul className="space-y-5 text-[15px] leading-[1.6]">
              {data.earningsSummary.map((line, idx) => (
                <li key={idx} className={`${line.startsWith('-') ? 'ml-5 text-gray-500 italic font-medium' : 'font-black text-black border-l-4 border-[#002B5B] pl-4'}`}>
                   {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-[6px] border-[#002B5B] pb-3">
            <span className="text-4xl font-[900] italic tracking-tighter text-[#002B5B]">BUSINESS HIGHLIGHTS</span>
          </div>
          <div className="space-y-6">
            {data.businessHighlights.map((bh, idx) => (
              <div key={idx} className="bg-white p-6 border border-gray-100 shadow-lg border-t-4 border-t-blue-500">
                <div className="bg-[#5B718B] text-white px-4 py-1.5 italic font-black text-xs inline-block mb-4 rounded-sm">
                  {bh.title}
                </div>
                <div className="text-[#002B5B] font-black italic text-2xl mb-4 text-center block w-full border-b border-dashed border-gray-200 pb-3">
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

        <div className="col-span-6 flex flex-col gap-6">
          <div className="border-b-[6px] border-[#002B5B] pb-3 text-right">
            <span className="text-4xl font-[900] italic tracking-tighter text-[#002B5B]">KEY INDICATORS</span>
          </div>
          <div className="p-4 bg-[#fdfdfd] border rounded-lg">
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data.indicatorHistory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="quarter" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 200]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 11, top: -10, fontWeight: 900 }} />
                     <Line type="monotone" dataKey="liquidityRatio" name="유동비율" stroke="#3B82F6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                     <Line type="monotone" dataKey="equityRatio" name="자기자본비율" stroke="#EF4444" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                     <Line type="monotone" dataKey="dependencyRatio" name="차입금의존도" stroke="#10B981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                     <Line type="monotone" dataKey="debtRatio" name="부채비율" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="mt-4 flex flex-col gap-5">
            <div className="border-b-[6px] border-[#002B5B] pb-3 text-right font-black italic text-4xl text-[#002B5B]">KCC IR</div>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-[#1e1b4b] text-white p-5 rounded-lg flex gap-4">
                  <MessageSquare className="w-8 h-8 text-blue-300" />
                  <div className="text-[12px] font-bold space-y-2">
                    {data.irSupport.map((line, idx) => <div key={idx}>{line}</div>)}
                  </div>
               </div>
               <div className="bg-[#002B5B] text-white p-5 rounded-lg flex gap-4">
                  <Briefcase className="w-8 h-8 text-blue-300" />
                  <div className="text-[11px] font-bold space-y-1">
                    {data.irAction.slice(0, 6).map((line, idx) => <div key={idx}>{line}</div>)}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10 border-t-[10px] border-[#002B5B] flex justify-between items-center text-[#002B5B] font-black">
        <div className="flex items-center gap-4">
          <Globe className="w-7 h-7 text-blue-700" />
          <span className="text-2xl tracking-tighter">kccworld.irpage.co.kr</span>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-7 h-7 text-blue-700" />
          <span className="text-2xl tracking-tighter">02-3480-5000</span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
