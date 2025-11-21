'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    inn: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email некорректен";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен быть не менее 8 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (formData.inn && !/^\d{10,12}$/.test(formData.inn)) {
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          inn: formData.inn || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setErrors({ submit: data.message || "Ошибка регистрации. Попробуйте снова." });
      }
    } catch {
      setErrors({ submit: "Ошибка регистрации. Попробуйте снова." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="btn-back mr-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Назад
            </button>
            <div className="logo-icon">G</div>
            <span className="logo-text">GEORGE&apos;S ANALYSIS</span>
          </div>
          <Link href="/login" className="nav-link-black">Вход</Link>
        </div>
      </header>

      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="register-form-container">
          <div className="register-card">
            <h1 className="text-24 mb-6 text-center">Регистрация</h1>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-field">
                <label htmlFor="email" className="text-14 font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "border-red-500" : ""}`}
                  placeholder="example@domain.com"
                />
                {errors.email && <p className="text-12 text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="password" className="text-14 font-medium text-gray-700 mb-1 block">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-12 text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword" className="text-14 font-medium text-gray-700 mb-1 block">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-12 text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="inn" className="text-14 font-medium text-gray-700 mb-1 block">
                  ИНН (необязательно)
                </label>
                <input
                  id="inn"
                  name="inn"
                  type="text"
                  value={formData.inn}
                  onChange={handleChange}
                  className={`form-input ${errors.inn ? "border-red-500" : ""}`}
                  placeholder="7701234567"
                />
                {errors.inn && <p className="text-12 text-red-600 mt-1">{errors.inn}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-14">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary form-submit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <p className="text-14 text-gray-600 text-center mt-4">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </main>

      
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-12 text-gray-500 text-center">
            © 2025 GEORGE&apos;S ANALYSIS. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;