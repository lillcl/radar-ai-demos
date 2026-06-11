import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Collections',
    links: [
      { label: 'Heritage', href: '#' },
      { label: 'Signature', href: '#' },
      { label: 'Limited', href: '#' },
      { label: 'Forthcoming', href: '#' },
      { label: 'Vintage & Archive', href: '#' },
    ],
  },
  {
    title: 'Atelier',
    links: [
      { label: 'The Manufacture', href: '#maison' },
      { label: 'Our Calibers', href: '#' },
      { label: 'Hand-Finishing', href: '#atelier' },
      { label: 'Servicing & Restoration', href: '#' },
      { label: 'Visit by Appointment', href: '#' },
    ],
  },
  {
    title: 'La Maison',
    links: [
      { label: 'Heritage', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Boutiques', href: '#' },
      { label: 'Warranty', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="relative text-foreground overflow-hidden"
      style={{ backgroundColor: 'hsl(28 14% 6%)' }}
    >
      <div className="grain opacity-30 absolute inset-0" />

      <div className="relative max-w-[1500px] mx-auto px-6 md:px-10 pt-20 md:pt-32 pb-10">
        {/* Top: CTA strip */}
        <div className="grid grid-cols-12 gap-6 pb-16 md:pb-24 border-b border-foreground/10">
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-[10px] tracking-[0.4em] text-champagne uppercase mb-6" style={{ color: 'hsl(38 50% 65%)' }}>
              For the patient client
            </p>
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              <span className="block">Receive the</span>
              <span className="block italic font-light" style={{ color: 'hsl(38 50% 65%)' }}>
                annual correspondence.
              </span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <p className="text-foreground/65 text-base md:text-lg max-w-md mb-8 text-pretty">
              Four letters a year. Complication releases, atelier news, and the rare piece we offer privately before it is announced.
            </p>
            <form className="flex items-center border-b border-foreground/30 pb-2 focus-within:border-champagne transition-colors">
              <Mail className="w-4 h-4 text-foreground/50 mr-3" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="your.address@maison.ch"
                className="flex-1 bg-transparent outline-none font-mono text-sm tracking-wide placeholder:text-foreground/30 py-2"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="ml-3 w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </form>
            <p className="mt-3 font-mono text-[9px] tracking-[0.32em] uppercase text-foreground/40">
              Discreet · No marketing · Unsubscribe in one click
            </p>
          </div>
        </div>

        {/* Middle: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="block">
              <span className="font-serif text-2xl tracking-[0.2em] block">AETHEL</span>
              <span className="font-mono text-[9px] tracking-[0.4em] text-foreground/50 uppercase block mt-1">
                Horologie · Suisse
              </span>
            </a>
            <p className="mt-6 text-sm text-foreground/60 max-w-xs text-pretty">
              A small house of twelve watchmakers in La Chaux-de-Fonds, established 1887.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-foreground/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-champagne mb-5" style={{ color: 'hsl(38 50% 65%)' }}>
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Atelier info strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-foreground/10">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-foreground/50">Atelier</p>
              <p className="text-sm">Rue du Parc 14, 2300 La Chaux-de-Fonds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-foreground/50">Bureau</p>
              <p className="text-sm">+41 32 123 45 67 · By appointment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-foreground/50">Correspondence</p>
              <p className="text-sm">correspondance@aethel.ch</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/40">
            © MMXXVI · AETHEL Horologie SA · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/40 hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/40 hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/40 hover:text-foreground transition-colors">
              Certification
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
