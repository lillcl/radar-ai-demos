import { motion } from 'framer-motion';

export type WatchVariant = {
  id: string;
  name: string;
  collection: string;
  reference: string;
  price: string;
  color: string;          // HSL used for background wash
  caseColor: string;      // bezel / case tone
  dialColor: string;      // dial face color
  strapColor: string;     // strap / bracelet tone
  handColor: string;      // hour/minute/second hand
  subDials: boolean;
  skeleton: boolean;
  notes: string[];
  description: string;
};

type Props = { variant: WatchVariant; className?: string };

/**
 * A photoreal-ish SVG luxury wristwatch.
 * Geometry is consistent across variants; only colors change.
 */
export default function Watch({ variant, className }: Props) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 500 700"
        className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`dial-${variant.id}`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor={variant.dialColor} stopOpacity="1" />
            <stop offset="100%" stopColor={variant.dialColor} stopOpacity="0.85" />
          </radialGradient>
          <linearGradient id={`bezel-${variant.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={variant.caseColor} stopOpacity="1" />
            <stop offset="50%" stopColor={variant.caseColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={variant.caseColor} stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`strap-${variant.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={variant.strapColor} stopOpacity="1" />
            <stop offset="100%" stopColor={variant.strapColor} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`shadow-${variant.id}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feFlood floodColor="#000" floodOpacity="0.25" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top strap */}
        <path
          d="M 180 60 L 320 60 L 312 240 L 188 240 Z"
          fill={`url(#strap-${variant.id})`}
          filter={`url(#shadow-${variant.id})`}
        />
        {/* Strap stitching */}
        {[80, 110, 140, 170, 200, 220].map((y) => (
          <line
            key={`ts-${y}`}
            x1="200" x2="300"
            y1={y} y2={y}
            stroke={variant.handColor}
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.5"
          />
        ))}

        {/* Crown */}
        <rect
          x="378" y="335" width="14" height="22"
          fill={`url(#bezel-${variant.id})`}
          rx="1"
        />
        <rect
          x="380" y="338" width="3" height="16"
          fill={variant.handColor} opacity="0.4"
        />

        {/* Watch case (outer bezel) */}
        <circle
          cx="250" cy="350" r="158"
          fill={`url(#bezel-${variant.id})`}
          filter={`url(#shadow-${variant.id})`}
        />
        {/* Bezel edge */}
        <circle
          cx="250" cy="350" r="158"
          fill="none"
          stroke={variant.caseColor}
          strokeWidth="2"
          opacity="0.9"
        />
        {/* Inner bezel ring */}
        <circle
          cx="250" cy="350" r="142"
          fill={variant.caseColor}
          opacity="0.95"
        />

        {/* Dial */}
        <circle
          cx="250" cy="350" r="138"
          fill={`url(#dial-${variant.id})`}
        />

        {/* Skeleton cutouts (skeleton variant) */}
        {variant.skeleton && (
          <g opacity="0.6">
            <circle cx="220" cy="320" r="22" fill={variant.caseColor} opacity="0.3" />
            <circle cx="280" cy="320" r="22" fill={variant.caseColor} opacity="0.3" />
            <circle cx="250" cy="385" r="22" fill={variant.caseColor} opacity="0.3" />
            <line x1="220" y1="320" x2="280" y2="320" stroke={variant.caseColor} strokeWidth="2" />
            <line x1="280" y1="320" x2="250" y2="385" stroke={variant.caseColor} strokeWidth="2" />
            <line x1="250" y1="385" x2="220" y2="320" stroke={variant.caseColor} strokeWidth="2" />
            <circle cx="250" cy="350" r="8" fill={variant.handColor} />
          </g>
        )}

        {/* Hour markers */}
        {!variant.skeleton && [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x1 = 250 + Math.cos(rad) * 118;
          const y1 = 350 + Math.sin(rad) * 118;
          const x2 = 250 + Math.cos(rad) * 128;
          const y2 = 350 + Math.sin(rad) * 128;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={variant.handColor}
              strokeWidth={i % 3 === 0 ? 3.5 : 2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Sub-dials */}
        {variant.subDials && !variant.skeleton && (
          <>
            <circle cx="250" cy="305" r="28" fill={variant.dialColor} opacity="0.4" stroke={variant.handColor} strokeWidth="0.8" />
            <circle cx="205" cy="385" r="28" fill={variant.dialColor} opacity="0.4" stroke={variant.handColor} strokeWidth="0.8" />
            <circle cx="295" cy="385" r="28" fill={variant.dialColor} opacity="0.4" stroke={variant.handColor} strokeWidth="0.8" />
            <text x="250" y="310" textAnchor="middle" fontSize="6" fill={variant.handColor} fontFamily="serif" opacity="0.6">60</text>
            <text x="205" y="390" textAnchor="middle" fontSize="6" fill={variant.handColor} fontFamily="serif" opacity="0.6">12</text>
            <text x="295" y="390" textAnchor="middle" fontSize="6" fill={variant.handColor} fontFamily="serif" opacity="0.6">30</text>
          </>
        )}

        {/* Center cap */}
        <circle cx="250" cy="350" r="4" fill={variant.handColor} />
        <circle cx="250" cy="350" r="2" fill={variant.caseColor} />

        {/* Hour hand */}
        <motion.line
          x1="250" y1="350"
          x2="250" y2="270"
          stroke={variant.handColor}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '250px 350px' }}
        />
        {/* Minute hand */}
        <motion.line
          x1="250" y1="350"
          x2="250" y2="248"
          stroke={variant.handColor}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: 90 }}
          animate={{ rotate: 60 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '250px 350px' }}
        />
        {/* Second hand */}
        <motion.line
          x1="250" y1="370"
          x2="250" y2="240"
          stroke={variant.color}
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
          style={{ transformOrigin: '250px 350px' }}
        />

        {/* Brand mark */}
        <text
          x="250" y="282"
          textAnchor="middle"
          fontSize="11"
          fontFamily="serif"
          letterSpacing="3"
          fill={variant.handColor}
          opacity="0.85"
        >
          AETHEL
        </text>
        <text
          x="250" y="296"
          textAnchor="middle"
          fontSize="5"
          fontFamily="serif"
          fontStyle="italic"
          letterSpacing="1.5"
          fill={variant.handColor}
          opacity="0.6"
        >
          horologie · suisse
        </text>

        {/* Bottom strap */}
        <path
          d="M 188 460 L 312 460 L 320 640 L 180 640 Z"
          fill={`url(#strap-${variant.id})`}
          filter={`url(#shadow-${variant.id})`}
        />
        {[480, 510, 540, 570, 600, 620].map((y) => (
          <line
            key={`bs-${y}`}
            x1="200" x2="300"
            y1={y} y2={y}
            stroke={variant.handColor}
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.5"
          />
        ))}

        {/* Lugs */}
        <rect x="178" y="240" width="20" height="22" fill={variant.caseColor} />
        <rect x="302" y="240" width="20" height="22" fill={variant.caseColor} />
        <rect x="178" y="438" width="20" height="22" fill={variant.caseColor} />
        <rect x="302" y="438" width="20" height="22" fill={variant.caseColor} />
      </svg>
    </div>
  );
}
