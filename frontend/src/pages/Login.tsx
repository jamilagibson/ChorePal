import { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';
import type { LoginApiResponse, SignupApiResponse } from '../types';

const orbs = [
  { size: 300, x: '10%',  y: '15%', color: '#4c8b83', duration: 18, delay: 0 },
  { size: 220, x: '75%',  y: '10%', color: '#0b2b4b', duration: 22, delay: 3 },
  { size: 260, x: '60%',  y: '65%', color: '#4c8b83', duration: 20, delay: 6 },
  { size: 180, x: '20%',  y: '70%', color: '#1a2b4c', duration: 25, delay: 2 },
  { size: 200, x: '85%',  y: '40%', color: '#4c8b83', duration: 16, delay: 9 },
];

const FloatingOrbs = (): React.JSX.Element => {
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      aria-hidden='true'
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            opacity: 0.08,
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -24, 0, 16, 0],
                  x: [0, 12, 0, -10, 0],
                }
          }
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

function Login(): React.JSX.Element {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const BASE_URL = 'http://localhost:3000';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const endpoint = isLoginMode ? '/users/login' : '/users';
    const payload = isLoginMode
      ? { email, password }
      : { email, password, name, children: [] };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (isLoginMode) {
        const data = (await response.json()) as LoginApiResponse;
        if (data.success) {
          setSuccess(true);
          setError('');
          if (data.token) localStorage.setItem('token', data.token);
          window.location.href = '/dashboard';
        } else {
          setError(data.message ?? 'Login failed');
          setSuccess(false);
        }
      } else {
        const data = (await response.json()) as SignupApiResponse;
        if (data.insertedId) {
          setSuccess(true);
          setError('');
          setIsLoginMode(true);
        } else {
          setError(data.message ?? 'Failed to create account');
          setSuccess(false);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
      setSuccess(false);
    }
  }

  function switchMode(): void {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess(false);
    setEmail('');
    setPassword('');
    setName('');
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <FloatingOrbs />

      {/* Top-right sign-up prompt pill */}
      <div className='signup-prompt'>
        <span className='signup-prompt-text'>
          {isLoginMode ? 'New to ChorePal?' : 'Already have an account?'}
        </span>
        <button onClick={switchMode} className='toggle-button'>
          {isLoginMode ? 'Sign up' : 'Log in'}
        </button>
      </div>

      <div className='wrapper' style={{ position: 'relative', zIndex: 1 }}>
        <div className='login-card'>
          <h1>Welcome to ChorePal!</h1>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-3'
            aria-describedby={error ? 'form-error' : undefined}
          >
            {!isLoginMode && (
              <div className='flex flex-col gap-1'>
                <label htmlFor='name'>Name:</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className='flex flex-col gap-1 field-password'>
              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button type='submit' className='login-submit-btn'>
              {isLoginMode ? 'Login' : 'Create Account'}
            </button>
          </form>

          {error && (
            <p
              id='form-error'
              role='alert'
              aria-live='assertive'
              className='error'
            >
              ⚠ {error}
            </p>
          )}
          {success && (
            <p role='status' aria-live='polite' className='success'>
              ✓{' '}
              {isLoginMode ? 'Login successful!' : 'Account created! Please login.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
