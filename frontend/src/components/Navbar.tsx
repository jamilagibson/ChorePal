import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import './WantedPoster.css';

interface NavbarProps {
  wantedUser: string | null;
}

const Navbar = ({ wantedUser }: NavbarProps): React.JSX.Element => {
  const navigate = useNavigate();
  const [isDark, toggleDark] = useDarkMode();

  function handleLogout(): void {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <nav aria-label='Main navigation' className='navbar'>
      {/* Left: logo + title stacked */}
      <div className='navbar-brand'>
        <img
          src='/chorepal-logo-optimized.png'
          width='60'
          height='60'
          alt='ChorePal Logo'
        />
        <div>
          <h1 className='navbar-title'>ChorePal</h1>
          <p className='navbar-tagline'>Plan it. Do it.</p>
        </div>
      </div>

      {/* Center: Wanted Poster — inline, not absolute */}
      {wantedUser && (
        <div className='wanted-poster' aria-label='Wanted poster'>
          <div className='poster-title' aria-hidden='true'>
            🔥 Wanted 🔥
          </div>
          <div className='poster-user'>{wantedUser}</div>
          <div className='poster-divider'>Needs to catch up!</div>
        </div>
      )}

      {/* Right: dark mode toggle + logout */}
      <div className='navbar-actions'>
        {/* Dark mode toggle — WCAG: role=switch, aria-checked, dynamic aria-label */}
        <button
          role='switch'
          aria-checked={isDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleDark}
          className='dark-toggle'
        >
          {isDark ? (
            /* Sun — shown in dark mode to switch to light */
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5'
              aria-hidden='true'
            >
              <path d='M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z' />
            </svg>
          ) : (
            /* Moon — shown in light mode to switch to dark */
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </button>

        <button onClick={handleLogout} className='logout-btn'>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
