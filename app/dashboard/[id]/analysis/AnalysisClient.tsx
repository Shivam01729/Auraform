'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Form, FormElement, Response, Answer } from '@prisma/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ArrowLeft, BarChart2, Users, LayoutTemplate, Sparkles } from 'lucide-react';

type FormWithData = Form & {
  elements: FormElement[];
  responses: (Response & { answers: Answer[] })[];
};

const COLORS = ['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalysisClient({ form }: { form: FormWithData }) {
  const totalResponses = form.responses.length;

  // Process data for charts
  const processElementData = (element: FormElement) => {
    if (totalResponses === 0) return null;

    const answers = form.responses.flatMap(r => r.answers.filter(a => a.elementId === element.id));

    if (element.type === 'multiple_choice') {
      const options = JSON.parse(element.options || '[]');
      const counts: Record<string, number> = {};
      options.forEach((opt: string) => (counts[opt] = 0));
      
      answers.forEach(a => {
        if (counts[a.value] !== undefined) {
          counts[a.value]++;
        } else {
          counts[a.value] = 1; 
        }
      });

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (element.type === 'rating') {
      const counts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
      let sum = 0;
      let validCount = 0;
      
      answers.forEach(a => {
        const val = a.value;
        if (counts[val as keyof typeof counts] !== undefined) {
          counts[val as keyof typeof counts]++;
          sum += parseInt(val);
          validCount++;
        }
      });
      
      const average = validCount > 0 ? (sum / validCount).toFixed(1) : '0.0';
      const chartData = Object.entries(counts).map(([name, value]) => ({ name: `${name} ★`, value }));

      return { chartData, average };
    }

    if (element.type === 'short_text' || element.type === 'email' || element.type === 'long_text') {
       return answers.map(a => a.value).filter(Boolean); // Array of text answers
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black font-sans pb-20 text-white">
      {/* Top Nav */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 px-6 py-4 flex items-center">
        <Link href="/dashboard" className="text-gray-500 hover:text-white mr-4 transition-colors p-2 rounded-full hover:bg-white/5">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
          <Sparkles size={24} className="text-purple-400" />
          <span className="font-bold text-xl tracking-tight text-white truncate max-w-md">
            Analytics: {form.title}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 flex items-center space-x-5 group hover:border-purple-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Users size={32} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Total Responses</p>
              <h2 className="text-5xl font-black text-white">{totalResponses}</h2>
            </div>
          </div>
          
          <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 flex items-center space-x-5 group hover:border-purple-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform">
              <LayoutTemplate size={32} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Questions</p>
              <h2 className="text-5xl font-black text-white">{form.elements.length}</h2>
            </div>
          </div>
        </div>

        {totalResponses === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-20 text-center">
            <BarChart2 size={64} className="mx-auto text-gray-800 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No data yet</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">Share your form link to start collecting responses and see live analytics here.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {form.elements.map((element, idx) => {
              const data = processElementData(element);
              
              return (
                <div key={element.id} className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/20 transition-all duration-300">
                  <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-start">
                     <span className="text-purple-400 font-bold text-2xl mr-4">{idx + 1}.</span>
                     <div>
                       <h3 className="text-xl font-bold text-white leading-tight mb-2">{element.question}</h3>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                         {element.type.replace('_', ' ')}
                       </span>
                     </div>
                  </div>
                  
                  <div className="p-8">
                    {/* Render Charts based on Type */}
                    {element.type === 'multiple_choice' && data && (
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data as any} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                            <XAxis type="number" allowDecimals={false} stroke="#333" tick={{fill: '#666', fontSize: 12}} hide />
                            <YAxis dataKey="name" type="category" width={150} stroke="#333" tick={{fill: '#999', fontSize: 14, fontWeight: 500}} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'}} />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                              {(data as any).map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {element.type === 'rating' && data && (
                      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-center w-full md:w-2/5 py-12 rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/5 shadow-2xl">
                          <p className="text-gray-500 font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Average Rating</p>
                          <div className="text-7xl font-black mb-2 flex justify-center items-baseline text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                            {(data as any).average}
                            <span className="text-3xl text-gray-800 ml-2 font-light">/ 5</span>
                          </div>
                        </div>
                        <div className="h-[280px] w-full md:w-3/5">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={(data as any).chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#333" tick={{fill: '#666', fontSize: 12}} />
                                <YAxis allowDecimals={false} stroke="#333" tick={{fill: '#666', fontSize: 12}} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}} />
                                <Bar dataKey="value" fill="url(#purpleGradient)" radius={[8, 8, 0, 0]} barSize={50} />
                                <defs>
                                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.4}/>
                                  </linearGradient>
                                </defs>
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {(element.type === 'short_text' || element.type === 'long_text' || element.type === 'email') && data && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                        {(data as string[]).map((answer, i) => (
                          <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-300 text-sm leading-relaxed italic group hover:border-purple-500/20 transition-all">
                            <span className="text-purple-500/40 text-2xl font-serif block mt--2 mb-1">“</span>
                            {answer}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
