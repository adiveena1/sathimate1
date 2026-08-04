'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AITravelAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi there! I am your Sathimate AI travel expert. Where in India would you like to explore together?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call the Gemini backend route I built earlier
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I hit a snag. Please make sure the GEMINI_API_KEY is active.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Hmm, the connection dropped. Let us try again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      {/* Floating Action Button - Mobile optimized */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="touch-none"
        >
          <Button 
            onClick={() => setIsOpen(true)}
            className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 transition-all duration-300"
            size="icon"
            aria-label="Open Sathimate AI Assistant"
          >
            <Bot className="h-5 md:h-6 w-5 md:w-6 text-primary-foreground" />
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[min(95vw,350px)] max-h-[min(85vh,500px)] shadow-2xl flex flex-col overflow-hidden border-2 border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CardHeader className="bg-primary text-primary-foreground py-3 flex flex-row items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Bot className="h-5 w-5 flex-shrink-0" />
              <div className="font-bold text-base truncate">Sathimate AI</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-9 w-9 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "px-3 py-2 max-w-[85%] rounded-2xl text-sm leading-relaxed break-words",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-white border shadow-sm rounded-tl-sm text-foreground"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-2 bg-white border-t flex-shrink-0">
            <form onSubmit={handleSend} className="flex w-full items-center gap-2">
              <Input 
                placeholder="Ask something..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="rounded-full border-primary/20 focus-visible:ring-primary/50 text-sm"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-full shrink-0 h-9 w-9">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
