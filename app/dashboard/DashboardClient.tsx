'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Sparkles, Plus, Trash2, BarChart2, LogOut, Loader2, Link as LinkIcon, Check } from 'lucide-react';

interface FormSummary {
  id: string;
  title: string;
  responsesCount: number;
  createdAt: string;
}

export default function DashboardClient({ forms: initialForms, email }: { forms: FormSummary[], email: string }) {
  const [forms, setForms] = useState(initialForms);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/f/${id}`;
    // navigator.clipboard requires HTTPS — use fallback for local HTTP
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url);
      } else {
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch {
      prompt('Copy this link:', url);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form and all its responses?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setForms(forms.filter(f => f.id !== id));
      } else {
        alert('Failed to delete form');
      }
    } catch (err) {
      alert('Error deleting form');
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-black font-sans pb-20">
      {/* Hero Banner with AI Image */}
      <div
        className="relative h-52 overflow-hidden"
        style={{
          backgroundImage: 'url(/dashboard_hero_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />

        {/* Navbar inside hero */}
        <nav className="relative z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles size={22} className="text-purple-400" />
            <span className="font-bold text-xl tracking-tight text-white">AuraForms</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-400 font-medium hidden md:block">{email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-400 hover:text-white flex items-center text-sm font-medium transition-colors gap-1.5"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </nav>

        {/* Hero heading */}
        <div className="relative z-10 px-6 mt-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Workspace</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your forms and view live analytics.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-gray-500 text-sm">{forms.length} form{forms.length !== 1 ? 's' : ''}</span>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/20 active:scale-95 duration-200"
          >
            <Plus size={18} />
            <span>New Form</span>
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center max-w-2xl mx-auto mt-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
              <Sparkles size={32} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No forms yet</h3>
            <p className="text-gray-500 mb-8 max-w-md">Get started by creating your first form. It only takes seconds!</p>
            <Link
              href="/builder"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 transition-all shadow-md hover:shadow-purple-500/30 inline-block"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map(form => (
              <div
                key={form.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col group"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-bold text-white leading-tight group-hover:text-purple-300 transition-colors line-clamp-2 flex-1 mr-3">
                      {form.title}
                    </h3>
                    <button
                      onClick={() => handleDelete(form.id)}
                      disabled={deletingId === form.id}
                      className="text-gray-600 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors shrink-0"
                      title="Delete Form"
                    >
                      {deletingId === form.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <span className="flex items-center gap-1">
                      <BarChart2 size={14} className="text-purple-400" />
                      {form.responsesCount} responses
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Created {new Date(form.createdAt).toLocaleDateString('en-GB')}</p>
                </div>

                <div className="px-6 py-4 bg-black/30 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => handleCopyLink(form.id)}
                    className="flex-1 flex justify-center items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                    title="Copy Public Link"
                  >
                    {copiedId === form.id ? <Check size={14} className="text-green-400" /> : <LinkIcon size={14} />}
                    <span>{copiedId === form.id ? 'Copied!' : 'Share'}</span>
                  </button>
                  <Link
                    href={`/dashboard/${form.id}/analysis`}
                    className="flex-1 flex justify-center items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 py-2 rounded-lg transition-all"
                  >
                    <BarChart2 size={14} />
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
