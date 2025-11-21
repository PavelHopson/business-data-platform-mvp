'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, saveAuthToken, LoginRequest } from '@/lib/api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Форма регистрации
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Форма входа
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Заглушка для регистрации - сразу переходим на dashboard
    try {
      // Имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Сохраняем фиктивный токен
      saveAuthToken('mock-token-' + Date.now());

      // Закрываем модал и переходим на dashboard
      onClose();
      router.push('/dashboard');
    } catch (err) {
      setError('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = {
        email: loginForm.email,
        password: loginForm.password
      };

      const response = await loginUser(loginData);
      
      if (response.success && response.token) {
        saveAuthToken(response.token);
        onClose();
        router.push('/dashboard');
      } else {
        setError(response.message || 'Ошибка входа');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className={`auth-modal-container ${mode === 'register' ? 'register' : ''}`} onClick={(e) => e.stopPropagation()}>
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-modal">
            <div className="auth-modal-header">
              <div className="auth-modal-title">Авторизация</div>
              <button type="button" className="auth-modal-close" onClick={onClose}>
                <img src="/images/che.svg" alt="Close" className="auth-modal-close-icon" />
              </button>
            </div>
            {error && (
              <div className="auth-modal-error">
                {error}
              </div>
            )}
            <div className="auth-modal-fields">
              <div className="auth-modal-field">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="auth-modal-input"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="auth-modal-field">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Пароль" 
                  className="auth-modal-input"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button 
                  type="button"
                  className="auth-modal-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img 
                    src={showPassword ? "/images/yes.svg" : "/images/no.svg"} 
                    alt={showPassword ? "Hide password" : "Show password"} 
                    className="auth-modal-password-icon" 
                  />
                </button>
              </div>
            </div>
            <div className="auth-modal-actions">
              <button type="submit" className="auth-modal-button-primary" disabled={loading}>
                <div className="auth-modal-button-text">
                  {loading ? 'Вход...' : 'Войти'}
                </div>
              </button>
              <div className="auth-modal-links">
                <button type="button" className="auth-modal-link">Забыли пароль?</button>
                <button type="button" className="auth-modal-link" onClick={() => onModeChange('register')}>Зарегистрироваться</button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-modal">
            <div className="auth-modal-header">
              <div className="auth-modal-title">Регистрация</div>
              <button type="button" className="auth-modal-close" onClick={onClose}>
                <img src="/images/che.svg" alt="Close" className="auth-modal-close-icon" />
              </button>
            </div>
            {error && (
              <div className="auth-modal-error">
                {error}
              </div>
            )}
            <div className="auth-modal-fields">
              <div className="auth-modal-field">
                <input 
                  type="text" 
                  placeholder="Имя" 
                  className="auth-modal-input"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="auth-modal-field">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="auth-modal-input"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="auth-modal-field">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Пароль" 
                  className="auth-modal-input"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button 
                  type="button"
                  className="auth-modal-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img 
                    src={showPassword ? "/images/yes.svg" : "/images/no.svg"} 
                    alt={showPassword ? "Hide password" : "Show password"} 
                    className="auth-modal-password-icon" 
                  />
                </button>
              </div>
              <div className="auth-modal-field">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Подтверждение пароля" 
                  className="auth-modal-input"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button 
                  type="button"
                  className="auth-modal-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img 
                    src={showConfirmPassword ? "/images/yes.svg" : "/images/no.svg"} 
                    alt={showConfirmPassword ? "Hide password" : "Show password"} 
                    className="auth-modal-password-icon" 
                  />
                </button>
              </div>
            </div>
            <div className="auth-modal-actions">
              <button type="button" className="auth-modal-button-secondary" onClick={() => onModeChange('login')}>
                <div className="auth-modal-button-text">Уже есть аккаунт? Войдите</div>
              </button>
              <button type="submit" className="auth-modal-button-primary" disabled={loading}>
                <div className="auth-modal-button-text">
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </div>
              </button>
              <div className="auth-modal-disclaimer">
                Нажимая на кнопку Зарегистрироваться, я даю своё согласие на обработку персональных данных
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
