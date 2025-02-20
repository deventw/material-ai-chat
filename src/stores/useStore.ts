import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { Message } from '../models/types';


interface ChatState {
  apiKey: string;
  messages: Message[];
  loading: boolean;
  error: string | null;
  apiKeyModalOpen: boolean;
  actions: {
    setApiKey: (key: string) => void;
    addMessage: (message: Omit<Message, 'id'>) => void;
    updateMessage: (id: string, content: string | ((currentContent: string) => string)) => void; // Supports functions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetChat: () => void;
    toggleApiKeyModal: () => void; 
  };
}

export const useStore = create<ChatState>((set) => ({
  apiKey: localStorage.getItem('openrouter-key') || '',
  messages: [],
  loading: false,
  error: null,
  apiKeyModalOpen: false, 
  actions: {
    setApiKey: (key) => {
      localStorage.setItem('openrouter-key', key);
      set({ apiKey: key });
    },
    addMessage: (message) => 
      set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: uuidv4(), // 生成唯一 UUID
            timestamp: Date.now()
          }
        ]
      })),

      updateMessage: (id, contentOrUpdater) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id
              ? {
                  ...msg,
                  content:
                    typeof contentOrUpdater === 'function'
                      ? contentOrUpdater(msg.content || '') // Handle function
                      : (msg.content || '') + (contentOrUpdater || ''), // Handle string
                }
              : msg
          ),
        })),
  
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    resetChat: () => set({ messages: [] }),
    toggleApiKeyModal: () =>
      set((state) => ({ apiKeyModalOpen: !state.apiKeyModalOpen })),
  }
}));