
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { chatService, ChatMessage } from '@/services/chat-service';
import { Send, Loader2, User, Sparkles, MapPin, Plane } from 'lucide-react';
import { format } from 'date-fns';

interface ChatDialogProps {
  receiverUid: string;
  receiverName: string;
  receiverPhoto?: string;
  trigger?: React.ReactNode;
}

export function ChatDialog({ receiverUid, receiverName, receiverPhoto, trigger }: ChatDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only subscribe when dialog is open
    if (!receiverUid || !open) {
      // Cleanup subscription when dialog closes
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }
    
    const unsubscribe = chatService.subscribeToMessages(receiverUid, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    
    unsubscribeRef.current = unsubscribe;
    
    // Cleanup when dependency changes or component unmounts
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [receiverUid, open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;
    
    setIsLoading(true);
    try {
      await chatService.sendMessage(receiverUid, inputText.trim());
      setInputText("");
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost">Chat</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[min(95vw,450px)] sm:max-w-[450px] p-0 overflow-hidden max-h-[min(95vh,600px)] flex flex-col border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-4 sm:p-6 bg-primary/5 border-b border-primary/10 flex flex-row items-center gap-3 sm:gap-4 space-y-0">
          <Avatar className="h-9 sm:h-10 w-9 sm:w-10 border-2 border-white shadow-sm hover:scale-105 transition-transform flex-shrink-0">
            <AvatarImage src={receiverPhoto} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base sm:text-lg font-black tracking-tight truncate">{receiverName}</DialogTitle>
            <div className="flex items-center gap-1 text-xs sm:text-xs sm:text-[10px] text-primary font-bold uppercase tracking-widest">
                 <Plane className="h-2.5 w-2.5 flex-shrink-0" /> Plan Together
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#FDFCF9]/50">
          <div className="text-center py-3 sm:py-4 opacity-50 space-y-1">
               <Sparkles className="h-4 w-4 mx-auto text-primary" />
               <p className="text-xs sm:text-xs sm:text-[10px] font-bold uppercase tracking-widest">Connected with {receiverName}</p>
               <p className="text-xs sm:text-xs sm:text-[10px] italic">You can now discuss your trip details.</p>
          </div>
          
          {messages.map((msg, i) => {
            const isMe = msg.senderUid === user?.uid;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border border-muted/20'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-xs sm:text-xs sm:text-[10px] opacity-70 mt-1 block h-fit ${isMe ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp?.toDate() ? format(msg.timestamp.toDate(), 'HH:mm') : ''}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 sm:p-6 bg-white border-t border-muted/10 flex gap-2 sm:gap-3 items-center sticky bottom-0">
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Plan something..."
            className="flex-1 h-10 sm:h-12 rounded-xl bg-muted/20 border-none shadow-inner focus-visible:ring-primary text-sm"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shadow-lg shadow-primary/20 flex-shrink-0" disabled={isLoading || !inputText.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
