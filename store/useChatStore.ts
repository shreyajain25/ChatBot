import { create } from 'zustand';
import { chatData } from '../ChatData';

export interface Message {
  id: string;
  sender: 'user' | 'ai_astrologer';
  text: string;
  timestamp: number;
  type: 'text' | 'ai';
  replyTo?: string | null;
  reactions: string[];
  hasFeedback?: boolean;
  feedback?: 'like' | 'dislike';
  selectedFeedback?: string | null;
}

interface ChatStore {
  messages: Message[];
  replyingTo: Message | null;
  rating: number;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setReplyingTo: (message: Message | null) => void;
  setRating: (rating: number) => void;
  addReaction: (messageId: string, emoji: string) => void;
  clearAll: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: chatData,
  replyingTo: null,
  rating: 0,

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setReplyingTo: (message) => set({ replyingTo: message }),

  setRating: (rating) => set({ rating }),

  addReaction: (messageId, emoji) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id === messageId) {
          const currentReaction =
            msg.reactions && msg.reactions.length > 0 ? msg.reactions[0] : null;
          const newReactions = currentReaction === emoji ? [] : [emoji];
          return { ...msg, reactions: newReactions };
        }
        return msg;
      }),
    })),

  clearAll: () =>
    set({
      messages: chatData,
      replyingTo: null,
      rating: 0,
    }),
}));
