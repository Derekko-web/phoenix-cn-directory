import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const EatDrinkIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="eatDrinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M8.5 8.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5-1 2.5-2.5 2.5-2.5-1-2.5-2.5z" fill="url(#eatDrinkGradient)"/>
    <path d="M12 12v8a1 1 0 0 1-2 0v-8m2 0h7a1 1 0 0 1 0 2h-7m0-2V4a1 1 0 0 1 2 0v8m-2 0H5a1 1 0 0 1 0-2h7" stroke="url(#eatDrinkGradient)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="3" fill="none" stroke="url(#eatDrinkGradient)" strokeWidth="1.5"/>
    <path d="M14.5 16h3M16 14.5v3" stroke="url(#eatDrinkGradient)" strokeWidth="1"/>
  </svg>
);

export const GroceriesIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="groceriesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M3 3h2l.4 2m0 0h13.6a1 1 0 0 1 .98 1.2l-1 5a1 1 0 0 1-.98.8H6m0 0v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M6 5l-1-2" 
          stroke="url(#groceriesGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="9" cy="21" r="1" fill="url(#groceriesGradient)"/>
    <circle cx="20" cy="21" r="1" fill="url(#groceriesGradient)"/>
    <path d="M8 12h8m-4-3v6" stroke="url(#groceriesGradient)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ServicesIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="servicesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-6.77 6.77l-1.6-1.6a1 1 0 0 0-1.4 0l-3.77 3.77a6 6 0 0 1 6.77-6.77l1.6 1.6a1 1 0 0 0 1.4 0L18.7 6.3a1 1 0 0 0 0-1.4"
          fill="url(#servicesGradient)"/>
    <path d="M9 12l2 2 4-4" stroke="url(#servicesGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="12" cy="12" r="9" stroke="url(#servicesGradient)" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const HealthIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#healthGradient)"/>
    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const EducationIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="educationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M12 3l8 4.5-8 4.5-8-4.5 8-4.5z" fill="url(#educationGradient)"/>
    <path d="M4 12v4.5l8 4.5 8-4.5V12" stroke="url(#educationGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M20 7.5v4.5a4 4 0 0 1-8 0V7.5" stroke="url(#educationGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export const CommunityIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="9" cy="7" r="4" stroke="url(#communityGradient)" strokeWidth="2" fill="none"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="12" cy="12" r="2" fill="url(#communityGradient)"/>
  </svg>
);

// Chinese Character Icons
export const ChineseCharacterIcon = ({ character, className = "", size = 32 }: { character: string; className?: string; size?: number }) => (
  <div 
    className={`flex items-center justify-center font-chinese font-bold ${className}`}
    style={{ 
      fontSize: `${size * 0.6}px`, 
      width: `${size}px`, 
      height: `${size}px`,
      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(245, 158, 11, 0.1))',
      borderRadius: '8px'
    }}
  >
    {character}
  </div>
);

// Icon mapping for categories
export const CategoryIcon = ({ category, size = 24, className = "" }: { category: string; size?: number; className?: string }) => {
  const iconMap = {
    eatDrink: <EatDrinkIcon size={size} className={className} />,
    groceries: <GroceriesIcon size={size} className={className} />,
    services: <ServicesIcon size={size} className={className} />,
    health: <HealthIcon size={size} className={className} />,
    education: <EducationIcon size={size} className={className} />,
    community: <CommunityIcon size={size} className={className} />,
  };

  const characterMap = {
    eatDrink: '食',
    groceries: '购',
    services: '务',
    health: '医',
    education: '学',
    community: '群',
  };

  return (
    <div className="flex items-center gap-3">
      {iconMap[category as keyof typeof iconMap]}
      <ChineseCharacterIcon 
        character={characterMap[category as keyof typeof characterMap]} 
        size={size} 
        className={className}
      />
    </div>
  );
};