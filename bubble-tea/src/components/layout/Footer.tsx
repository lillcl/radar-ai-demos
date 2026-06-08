import React from 'react';
import { Camera, Send, MessageCircle, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-foreground text-background py-24 px-6 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
          <div className="md:col-span-2">
            <h2 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-8 text-primary">LUXTEA</h2>
            <p className="text-background/60 text-xl max-w-sm mb-12 leading-relaxed">
              Redefining the bubble tea experience through luxury, craftsmanship, and pure ingredients.
            </p>
            <div className="flex gap-6">
              {[Camera, Send, MessageCircle].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-12 h-12 rounded-full border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.4em] font-bold mb-8 text-primary/80">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {['Collections', 'Process', 'Boutique', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-lg hover:text-primary transition-colors flex items-center group">
                    {item}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.4em] font-bold mb-8 text-primary/80">Connect</h4>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs text-background/40 uppercase tracking-widest mb-2">Email</p>
                <a href="mailto:hello@luxtea.com" className="text-xl hover:text-primary transition-colors">hello@luxtea.com</a>
              </div>
              <div>
                <p className="text-xs text-background/40 uppercase tracking-widest mb-2">Press</p>
                <a href="#" className="text-xl hover:text-primary transition-colors">press@luxtea.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-background/40 text-sm">
            © 2026 LUXTEA Artisanal Brewing. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-background/40">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
