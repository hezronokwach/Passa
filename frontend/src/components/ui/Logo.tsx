import { COLORS } from '../../utils/colors'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-pulse-glow"
      >
        {/* Outer hexagonal frame */}
        <path
          d="M20 2 L32 8 L32 22 L20 28 L8 22 L8 8 Z"
          stroke="url(#neonGradient1)"
          strokeWidth="1.5"
          fill="none"
          className="animate-neon-flicker"
        />

        {/* Inner hexagonal grid */}
        <path
          d="M20 6 L28 10 L28 20 L20 24 L12 20 L12 10 Z"
          stroke="url(#neonGradient2)"
          strokeWidth="1"
          fill="url(#darkFill)"
          opacity="0.8"
        />

        {/* Central blockchain node */}
        <circle
          cx="20"
          cy="20"
          r="3"
          fill="url(#centralGlow)"
          className="animate-glow"
        />

        {/* Connection lines forming network */}
        <g stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7">
          <line x1="20" y1="6" x2="20" y2="14" strokeLinecap="round" />
          <line x1="20" y1="26" x2="20" y2="34" strokeLinecap="round" />
          <line x1="12" y1="10" x2="17" y2="17" strokeLinecap="round" />
          <line x1="23" y1="23" x2="28" y2="30" strokeLinecap="round" />
          <line x1="28" y1="10" x2="23" y2="17" strokeLinecap="round" />
          <line x1="17" y1="23" x2="12" y2="30" strokeLinecap="round" />
        </g>

        {/* Corner nodes */}
        <circle cx="20" cy="6" r="1.5" fill="url(#nodeGlow)" className="animate-float" />
        <circle cx="28" cy="10" r="1.5" fill="url(#nodeGlow)" className="animate-float" style={{animationDelay: '0.5s'}} />
        <circle cx="28" cy="20" r="1.5" fill="url(#nodeGlow)" className="animate-float" style={{animationDelay: '1s'}} />
        <circle cx="20" cy="24" r="1.5" fill="url(#nodeGlow)" className="animate-float" style={{animationDelay: '1.5s'}} />
        <circle cx="12" cy="20" r="1.5" fill="url(#nodeGlow)" className="animate-float" style={{animationDelay: '2s'}} />
        <circle cx="12" cy="10" r="1.5" fill="url(#nodeGlow)" className="animate-float" style={{animationDelay: '2.5s'}} />

        {/* Particle effects */}
        <g opacity="0.6">
          <circle cx="15" cy="15" r="0.5" fill={COLORS.CYBER_BLUE_HEX} className="animate-pulse" />
          <circle cx="25" cy="15" r="0.5" fill={COLORS.CYBER_PURPLE_HEX} className="animate-pulse" style={{animationDelay: '0.3s'}} />
          <circle cx="25" cy="25" r="0.5" fill={COLORS.CYBER_GREEN_HEX} className="animate-pulse" style={{animationDelay: '0.6s'}} />
          <circle cx="15" cy="25" r="0.5" fill={COLORS.CYBER_PINK_HEX} className="animate-pulse" style={{animationDelay: '0.9s'}} />
        </g>

        <defs>
          <linearGradient id="neonGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="50%" stopColor={COLORS.CYBER_PURPLE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_GREEN_HEX} />
          </linearGradient>
          <linearGradient id="neonGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} opacity="0.3" />
            <stop offset="100%" stopColor={COLORS.CYBER_PURPLE_HEX} opacity="0.3" />
          </linearGradient>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_GREEN_HEX} />
          </linearGradient>
          <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="50%" stopColor={COLORS.CYBER_PURPLE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_GREEN_HEX} />
          </radialGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_PURPLE_HEX} />
          </radialGradient>
          <radialGradient id="darkFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.DARK_SURFACE_HEX} opacity="0.8" />
            <stop offset="100%" stopColor={COLORS.DARK_BG_HEX} opacity="0.9" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default Logo
