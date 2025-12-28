import React from 'react';
import { NavLink } from 'react-router-dom';
import { GithubLogo, LinkedinLogo, Envelope, List, X, Moon, Sun, Globe } from '@phosphor-icons/react';
import { useAppContext } from '../contexts/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { content, toggleLanguage, toggleTheme, theme, language } = useAppContext();

  const navItems = [
    { label: content.nav.about, path: '/' },
    { label: content.nav.experience, path: '/experience' },
    { label: content.nav.blog, path: '/blog' },
    { label: content.nav.books, path: '/books' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-6 py-8 md:py-16 bg-background transition-colors duration-300">
      <header className="flex flex-row justify-between items-center mb-16 md:mb-24">
        <div className="flex flex-col">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-primary tracking-tight">
            {content.personalInfo.name}
          </h1>
          <span className="text-xs md:text-sm text-secondary mt-1 font-light tracking-wide uppercase">
            {content.personalInfo.role.split('|')[0]}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 hover:text-primary ${isActive ? 'text-primary border-b border-primary pb-0.5' : 'text-secondary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-accent">
            <button
              onClick={toggleLanguage}
              className="text-xs font-mono font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1"
              title="Switch Language"
            >
              <Globe size={16} />
              {language.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className="text-secondary hover:text-primary transition-colors p-1"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <button
            className="md:hidden text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-6 mb-8 border-b border-accent pb-8 animate-fade-in-down">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg font-serif transition-colors ${isActive ? 'text-primary font-medium' : 'text-secondary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="flex gap-6 pt-4 mt-2 border-t border-accent">
            <button
              onClick={toggleLanguage}
              className="text-sm font-mono font-medium text-secondary hover:text-primary flex items-center gap-2"
            >
              <Globe size={20} />
              {language === 'pt' ? 'Português' : 'English'}
            </button>
            <button
              onClick={toggleTheme}
              className="text-secondary hover:text-primary flex items-center gap-2 text-sm font-medium"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </nav>
      )}

      <main className="flex-grow animate-fade-in">
        {children}
      </main>

      <footer className="mt-24 pt-8 border-t border-accent flex flex-col md:flex-row justify-between items-center text-sm text-secondary gap-4">
        <div>
          &copy; {new Date().getFullYear()} {content.personalInfo.name}.
        </div>
        <div className="flex gap-6 items-center">
          <a
            href={content.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:scale-110 duration-200"
            title="LinkedIn"
          >
            <LinkedinLogo size={22} weight="light" />
          </a>
          <a
            href={content.personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:scale-110 duration-200"
            title="GitHub"
          >
            <GithubLogo size={22} weight="light" />
          </a>
          <a
            href={`mailto:${content.personalInfo.email}`}
            className="hover:text-primary transition-colors hover:scale-110 duration-200"
            title="Email"
          >
            <Envelope size={22} weight="light" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
