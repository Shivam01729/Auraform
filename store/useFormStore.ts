import { create } from 'zustand';

export type FormElementType = 
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'rating'
  | 'email';

export interface FormElement {
  id: string;
  type: FormElementType;
  question: string;
  description?: string;
  options?: string[];
  required: boolean;
}

export interface Form {
  id: string;
  title: string;
  elements: FormElement[];
}

interface FormStore {
  form: Form;
  addFormElement: (type: FormElementType) => void;
  updateFormElement: (id: string, updates: Partial<FormElement>) => void;
  removeFormElement: (id: string) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
}

// Safe UUID generator that works on HTTP (local network) and HTTPS
function safeId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {}
  // Fallback: timestamp + random
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export const useFormStore = create<FormStore>((set) => ({
  form: {
    id: safeId(),
    title: 'Untitled Form',
    elements: [],
  },

  addFormElement: (type) =>
    set((state) => {
      const newElement: FormElement = {
        id: safeId(),
        type,
        question: '',
        required: false,
        ...(type === 'multiple_choice' ? { options: ['Option 1'] } : {}),
      };

      return {
        form: {
          ...state.form,
          elements: [...state.form.elements, newElement],
        },
      };
    }),

  updateFormElement: (id, updates) =>
    set((state) => ({
      form: {
        ...state.form,
        elements: state.form.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      },
    })),

  removeFormElement: (id) =>
    set((state) => ({
      form: {
        ...state.form,
        elements: state.form.elements.filter((el) => el.id !== id),
      },
    })),

  reorderElements: (startIndex, endIndex) =>
    set((state) => {
      const newElements = Array.from(state.form.elements);
      const [removed] = newElements.splice(startIndex, 1);
      newElements.splice(endIndex, 0, removed);

      return {
        form: {
          ...state.form,
          elements: newElements,
        },
      };
    }),
}));
