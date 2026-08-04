'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function TelegramWidget() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-40 touch-none"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                size="icon" 
                className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:shadow-xl"
              >
                <Link 
                  href="https://t.me/Sathimate/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Chat with us on Telegram"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-blue-600 text-white border-blue-600 font-medium">
          Chat with us on Telegram
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
