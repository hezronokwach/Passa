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
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle representing the sphere */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Inner connecting lines representing connections */}
        <path
          d="M8 20 L32 20 M20 8 L20 32 M12 12 L28 28 M28 12 L12 28"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Central hub */}
        <circle
          cx="20"
          cy="20"
          r="4"
          fill="url(#gradient3)"
        />
        
        {/* Connection nodes */}
        <circle cx="8" cy="20" r="2" fill="url(#gradient4)" />
        <circle cx="32" cy="20" r="2" fill="url(#gradient4)" />
        <circle cx="20" cy="8" r="2" fill="url(#gradient4)" />
        <circle cx="20" cy="32" r="2" fill="url(#gradient4)" />
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
          <radialGradient id="gradient4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default Logo
