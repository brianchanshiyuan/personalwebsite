import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get system preference
const getSystemPreference = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Helper function to get saved theme from localStorage
const getSavedTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('theme');
  return saved === 'dark' || saved === 'light' ? saved : null;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);
  // Set theme on initial load
  useEffect(() => {
    const savedTheme = getSavedTheme();
    const systemPrefersDark = getSystemPreference() === 'dark';
    
    // Apply the theme before React renders to prevent FOUC
    const root = document.documentElement;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      root.classList.toggle('dark', savedTheme === 'dark');
      root.style.colorScheme = savedTheme;
    } else {
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      root.classList.toggle('dark', initialTheme === 'dark');
      root.style.colorScheme = initialTheme;
    }
    
    setIsMounted(true);
    
    // Listen for system theme changes (only if no saved theme)
    if (!savedTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        root.classList.toggle('dark', newTheme === 'dark');
        root.style.colorScheme = newTheme;
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (!isMounted) return;
    
    const root = document.documentElement;
    
    // Add transition class for smooth theme changes
    root.classList.add('theme-transition');
    
    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Don't render the app until we know the theme to prevent flash of wrong theme
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      <div className={`theme-${theme} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
