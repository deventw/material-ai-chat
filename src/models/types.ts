export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
  
  export type ApiKeyModalProps = {
    open: boolean;
    onClose: () => void;
  };
  
  export type ChatMessageProps = Message & {
    loading?: boolean;
  };
