import { Instagram, Facebook, Twitter, Linkedin, Youtube, Rss, MessageSquare, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/sathimate.in/', icon: <Instagram /> },
  { name: 'Facebook', href: 'https://facebook.com', icon: <Facebook /> },
  { name: 'X', href: 'https://x.com', icon: <Twitter /> },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin /> },
  { name: 'YouTube', href: 'https://youtube.com', icon: <Youtube /> },
  { name: 'WhatsApp', href: 'https://whatsapp.com', icon: <MessageCircle /> },
  { name: 'Telegram', href: 'https://t.me/Sathimate/', icon: <MessageSquare /> },
  { name: 'Snapchat', href: 'https://snapchat.com', icon: null },
  { name: 'Pinterest', href: 'https://pinterest.com', icon: null },
  { name: 'Reddit', href: 'https://www.reddit.com/r/sathimate/', icon: <Rss /> },
  { name: 'Discord', href: 'https://discord.com', icon: null },
];

export function SocialLinks() {
  return (
    <>
      <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Follow Us</h3>
      <ul className="mt-4 space-y-2">
        {socialLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {link.icon && React.cloneElement(link.icon, { className: 'h-5 w-5' })}
              </div>
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
