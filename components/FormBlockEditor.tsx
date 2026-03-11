'use client';

import React from 'react';
import { FormElement, useFormStore } from '../store/useFormStore';
import { Trash2, GripVertical, Plus, X } from 'lucide-react';

interface FormBlockEditorProps {
  element: FormElement;
  index: number;
}

export function FormBlockEditor({ element, index }: FormBlockEditorProps) {
  const { updateFormElement, removeFormElement } = useFormStore();

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!element.options) return;
    const newOptions = [...element.options];
    newOptions[optionIndex] = value;
    updateFormElement(element.id, { options: newOptions });
  };

  const handleAddOption = () => {
    if (!element.options) return;
    updateFormElement(element.id, {
      options: [...element.options, `Option ${element.options.length + 1}`],
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (!element.options) return;
    const newOptions = element.options.filter((_, i) => i !== optionIndex);
    updateFormElement(element.id, { options: newOptions });
  };

  const typeLabel: Record<string, string> = {
    short_text: 'Short Text',
    long_text: 'Long Text',
    multiple_choice: 'Multiple Choice',
    rating: 'Rating',
    email: 'Email',
  };

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-6 mb-4 hover:border-purple-500/30 transition-all duration-200 relative group shadow-lg">
      {/* Drag Handle & Delete */}
      <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing rounded-lg hover:bg-white/5">
          <GripVertical size={16} />
        </button>
        <button
          onClick={() => removeFormElement(element.id)}
          className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Type Badge */}
      <div className="flex items-center mb-4">
        <span className="bg-purple-500/15 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/20">
          {typeLabel[element.type] || element.type}
        </span>
      </div>

      {/* Question Input */}
      <input
        type="text"
        placeholder="Your question here..."
        value={element.question}
        onChange={(e) => updateFormElement(element.id, { question: e.target.value })}
        className="w-full text-lg font-semibold text-white bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-purple-500 focus:ring-0 px-0 py-2 mb-5 transition-colors outline-none placeholder-gray-700"
      />

      {/* Required Toggle */}
      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-5">
        <label className="flex items-center cursor-pointer gap-3">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={element.required}
              onChange={(e) => updateFormElement(element.id, { required: e.target.checked })}
            />
            <div className={`block w-9 h-5 rounded-full transition-colors ${element.required ? 'bg-purple-600' : 'bg-white/10'}`} />
            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow ${element.required ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="font-medium text-gray-500">Required</span>
        </label>
      </div>

      {/* Element Type Previews */}
      {element.type === 'multiple_choice' && (
        <div className="space-y-2.5">
          {element.options?.map((option, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-4 h-4 border border-white/20 rounded-full flex-shrink-0" />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="flex-1 bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-purple-500 focus:ring-0 px-0 py-1 text-sm text-gray-300 outline-none transition-colors"
              />
              <button
                onClick={() => handleRemoveOption(idx)}
                className="text-gray-700 hover:text-red-400 p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="flex items-center text-xs font-medium text-gray-600 hover:text-purple-400 transition-colors mt-2 gap-1"
          >
            <Plus size={14} /> Add Option
          </button>
        </div>
      )}

      {element.type === 'short_text' && (
        <div className="w-1/2 border-b border-white/10 pb-2 text-gray-700 text-sm">Short answer text</div>
      )}

      {element.type === 'long_text' && (
        <div className="w-full border-b border-white/10 pb-8 text-gray-700 text-sm">Long answer text</div>
      )}

      {element.type === 'email' && (
        <div className="w-1/2 border-b border-white/10 pb-2 text-gray-700 text-sm">Email address</div>
      )}

      {element.type === 'rating' && (
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="text-purple-800/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
