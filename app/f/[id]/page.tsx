'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFormStore } from '../../../store/useFormStore';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star, ChevronRight } from 'lucide-react';

export default function RespondentPage() {
  const { form } = useFormStore();
  const params = useParams();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          useFormStore.setState({ form: data.form });
        }
      } catch (error) {
        console.error('Failed to fetch form', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (form.id !== params.id) {
      fetchForm();
    } else {
      setIsLoading(false);
    }
  }, [params.id, form.id]);

  const elements = form.elements || [];

  const handleAnswerChange = (elementId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [elementId]: value }));
    if (errors[elementId]) {
      setErrors(prev => { const n = { ...prev }; delete n[elementId]; return n; });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    for (const el of elements) {
      if (el.required && !answers[el.id]) {
        newErrors[el.id] = 'This field is required';
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: params.id, answers })
      });
    } catch (err) {
      console.error('Failed saving responses', err);
    }
    setIsCompleted(true);
    setSubmitting(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading form...</p>
        </div>
      </div>
    );
  }

  // Empty form
  if (!elements || elements.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Sparkles size={40} className="text-purple-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white">Form not found or empty.</h1>
        </div>
      </div>
    );
  }

  // Completion state
  if (isCompleted) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-600" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <Check size={36} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white">Thank you! 🎉</h1>
          <p className="text-gray-500 text-lg">Your response has been recorded successfully.</p>
        </motion.div>
      </div>
    );
  }

  const answeredCount = elements.filter(el => answers[el.id] !== undefined && answers[el.id] !== '').length;
  const progress = elements.length > 0 ? (answeredCount / elements.length) * 100 : 0;

  const renderInput = (element: typeof elements[0]) => {
    const val = answers[element.id];

    switch (element.type) {
      case 'short_text':
      case 'email':
        return (
          <input
            type={element.type === 'email' ? 'email' : 'text'}
            value={val || ''}
            onChange={(e) => handleAnswerChange(element.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full mt-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
          />
        );
      case 'long_text':
        return (
          <textarea
            value={val || ''}
            onChange={(e) => handleAnswerChange(element.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full mt-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base resize-none min-h-[120px]"
          />
        );
      case 'multiple_choice': {
        let optionsArray: string[] = [];
        try {
          optionsArray = typeof element.options === 'string'
            ? JSON.parse(element.options)
            : (Array.isArray(element.options) ? element.options : []);
        } catch {}

        return (
          <div className="mt-3 space-y-2.5">
            {optionsArray.map((option, idx) => {
              const isSelected = val === option;
              const letter = String.fromCharCode(65 + idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(element.id, option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 text-sm font-medium ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-gray-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
                    isSelected ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-gray-500 border-white/10'
                  }`}>
                    {letter}
                  </div>
                  <span>{option}</span>
                  {isSelected && <Check size={16} className="ml-auto text-purple-400" />}
                </button>
              );
            })}
          </div>
        );
      }
      case 'rating':
        return (
          <div className="mt-4 flex gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleAnswerChange(element.id, num)}
                className={`w-14 h-14 rounded-xl text-lg font-semibold border-2 flex items-center justify-center transition-all ${
                  val === num
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-1 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h1 className="text-white font-bold text-base truncate max-w-xs">{form.title}</h1>
          </div>
          <span className="text-xs text-gray-600">{answeredCount}/{elements.length} answered</span>
        </div>
      </div>

      {/* Single page form — all questions visible */}
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {elements.map((element, index) => (
          <motion.div
            key={element.id}
            id={`field-${element.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`bg-white/[0.03] border rounded-2xl p-6 transition-all duration-200 ${
              errors[element.id] ? 'border-red-500/50' : 'border-white/8 hover:border-purple-500/30'
            }`}
          >
            {/* Question number + question */}
            <div className="flex items-start gap-3 mb-2">
              <span className="text-purple-400 font-bold text-sm mt-1 shrink-0 flex items-center gap-1">
                {index + 1} <ChevronRight size={14} />
              </span>
              <h2 className="text-white font-semibold text-base leading-snug">
                {element.question || 'Untitled question'}
                {element.required && <span className="text-red-400 ml-1">*</span>}
              </h2>
            </div>

            {/* Input */}
            <div className="ml-6">
              {renderInput(element)}
              {errors[element.id] && (
                <p className="mt-2 text-red-400 text-xs">{errors[element.id]}</p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: elements.length * 0.05 }}
          className="pt-4"
        >
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition-all shadow-2xl shadow-purple-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Check size={20} /> Submit Form</>
            )}
          </button>
          <p className="text-center text-xs text-gray-700 mt-3">Fields marked with * are required</p>
        </motion.div>
      </div>
    </div>
  );
}
