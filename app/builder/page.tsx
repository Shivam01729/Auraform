'use client';

import React, { useState } from 'react';
import { useFormStore, FormElementType } from '../../store/useFormStore';
import { FormBlockEditor } from '../../components/FormBlockEditor';
import { Type, AlignLeft, List, Star, Mail, Sparkles, Share2, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BuilderPage() {
  const { form, addFormElement } = useFormStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handleAddBlock = (type: FormElementType) => {
    addFormElement(type);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const payload = {
        title: form.title || 'Untitled Form',
        elements: form.elements
      };

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        alert('You must be logged in to publish a form!');
        router.push('/login');
        setIsPublishing(false);
        return;
      }

      const data = await res.json();

      if (res.ok && data.form) {
        router.push('/dashboard');
      } else {
        alert('Error publishing: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to publish form.');
    }
    setIsPublishing(false);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0d0d0d] border-r border-white/5 overflow-y-auto flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles size={20} className="text-purple-400" />
              <h1 className="text-lg font-bold tracking-tight text-white">AuraForms</h1>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-400 transition-colors">
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>

        <div className="p-5 flex-1">
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">
            Add Elements
          </h2>

          <div className="space-y-2">
            <SidebarButton icon={<Type size={16} />} label="Short Text" onClick={() => handleAddBlock('short_text')} />
            <SidebarButton icon={<AlignLeft size={16} />} label="Long Text" onClick={() => handleAddBlock('long_text')} />
            <SidebarButton icon={<List size={16} />} label="Multiple Choice" onClick={() => handleAddBlock('multiple_choice')} />
            <SidebarButton icon={<Star size={16} />} label="Rating" onClick={() => handleAddBlock('rating')} />
            <SidebarButton icon={<Mail size={16} />} label="Email" onClick={() => handleAddBlock('email')} />
          </div>
        </div>

        <div className="p-5 border-t border-white/5">
          <p className="text-xs text-gray-600 text-center">Click elements above to add them to your form canvas.</p>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto bg-[#080808] p-10">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <header className="mb-8 flex items-start justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                defaultValue={form.title}
                className="text-3xl font-extrabold text-white bg-transparent border-0 border-b-2 border-transparent hover:border-white/10 focus:border-purple-500 focus:ring-0 px-0 py-2 w-full transition-colors outline-none placeholder-gray-700"
                placeholder="Form Title"
                onChange={(e) => useFormStore.setState({ form: { ...form, title: e.target.value } })}
              />
              <p className="text-gray-600 mt-2 text-sm">Click elements on the left to build your form.</p>
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublishing || form.elements.length === 0}
              className="mt-1 flex items-center shrink-0 gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 active:scale-95"
            >
              {isPublishing ? (
                <><Loader2 size={16} className="animate-spin" /><span>Publishing...</span></>
              ) : (
                <><Share2 size={16} /><span>Publish</span></>
              )}
            </button>
          </header>

          {/* Form Elements */}
          <div className="space-y-3">
            {form.elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02] text-gray-700">
                <Sparkles size={40} className="text-purple-800/50 mb-4" />
                <p className="text-base font-medium text-gray-600">Your canvas is empty</p>
                <p className="text-sm text-gray-700 mt-1">Add elements from the sidebar to get started.</p>
              </div>
            ) : (
              form.elements.map((element, index) => (
                <FormBlockEditor key={element.id} element={element} index={index} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300 transition-all text-left group text-gray-400"
    >
      <div className="text-gray-600 group-hover:text-purple-400 transition-colors">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">+</div>
      </div>
    </button>
  );
}
