// components/PromptConsole.tsx - Componente de entrada de prompt

'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props para el componente PromptConsole
 */
interface PromptConsoleProps {
  /** Callback cuando se envía el prompt */
  onSubmit: (prompt: string) => void;
  /** Si está cargando/ejecutando */
  isLoading?: boolean;
  /** Placeholder del input */
  placeholder?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de entrada de texto para prompts
 * @param props - Props del componente
 */
export const PromptConsole: React.FC<PromptConsoleProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Escribe tu prompt aquí...",
  className,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue('');
      textareaRef.current?.focus();
    }
  };

  /**
   * Maneja el evento de teclado para enviar con Ctrl+Enter
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative bg-white rounded-lg shadow-lg border border-gray-200">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full p-4 pr-12 text-gray-900 placeholder-gray-400 border-0 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="absolute bottom-4 right-4 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Presiona Ctrl+Enter para enviar
      </p>
    </form>
  );
};