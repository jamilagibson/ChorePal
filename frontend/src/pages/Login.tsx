import { useState } from 'react';
import './Login.css';
import type { LoginApiResponse, SignupApiResponse } from '../types';

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
    <div className='wrapper'>
      <div>
        <h1>
          Welcome to ChorePal
          <span className='block'>
            {isLoginMode ? 'Login' : 'Create Account'}
          </span>
        </h1>
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

          <div className='flex flex-col gap-1'>
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

          <button type='submit'>
            {isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>

        <button onClick={switchMode} style={{ marginTop: '10px' }}>
          {isLoginMode ? 'Create an account' : 'Already have an account? Login'}
        </button>

        {error && (
          <p
            id='form-error'
            role='alert'
            aria-live='assertive'
            style={{ color: 'red' }}
          >
            ⚠ {error}
          </p>
        )}
        {success && (
          <p role='status' aria-live='polite' style={{ color: 'green' }}>
            ✓{' '}
            {isLoginMode ? 'Login successful!' : 'Account created! Please login.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
