'use client';

import React, { useState, useCallback } from 'react';
import { SearchResult } from '@/lib/api/search';


export interface ContractorCardProps {
  contractor: SearchResult;
  onClick?: (contractor: SearchResult) => void;
  showDetailedInfo?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}


export default function ContractorCard({
  contractor,
  onClick,
  showDetailedInfo = false,
  className = '',
  variant = 'default',
}: ContractorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

 
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(contractor);
    }
  }, [contractor, onClick]);

 
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }, []);

  const getRatingColor = useCallback((level: string): string => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getRatingText = useCallback((level: string): string => {
    switch (level) {
      case 'high':
        return 'Высокая надежность';
      case 'medium':
        return 'Средняя надежность';
      case 'low':
        return 'Низкая надежность';
      default:
        return 'Неизвестно';
    }
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    return status === 'active' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  }, []);

 
  const getStatusText = useCallback((status: string): string => {
    return status === 'active' ? 'Активен' : 'Неактивен';
  }, []);

  const baseClasses = `
    bg-white rounded-lg border border-gray-200 transition-all duration-200
    ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-300' : ''}
    ${isHovered && onClick ? 'transform -translate-y-1' : ''}
    ${className}
  `;

  if (variant === 'compact') {
    return (
      <div
        className={`${baseClasses} p-4`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={`Карточка контрагента ${contractor.name}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {contractor.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              ИНН: {contractor.inn}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contractor.status)}`}>
              {getStatusText(contractor.status)}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRatingColor(contractor.rating.level)}`}>
              {contractor.rating.score}/100
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={`${baseClasses} p-6`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={`Детальная карточка контрагента ${contractor.name}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {contractor.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ИНН: {contractor.inn}</span>
              <span>ОГРН: {contractor.ogrn}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(contractor.status)}`}>
              {getStatusText(contractor.status)}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRatingColor(contractor.rating.level)}`}>
              {getRatingText(contractor.rating.level)} ({contractor.rating.score}/100)
            </span>
          </div>
        </div>

        {contractor.address && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Адрес:</h4>
            <p className="text-sm text-gray-600">{contractor.address}</p>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Дата регистрации:</h4>
          <p className="text-sm text-gray-600">{formatDate(contractor.registrationDate || null)}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Рейтинг надежности:</h4>
            <span className="text-sm font-semibold text-gray-900">{contractor.rating.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                contractor.rating.level === 'high' ? 'bg-green-500' :
                contractor.rating.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${contractor.rating.score}%` }}
            />
          </div>
        </div>

        {onClick && (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Подробнее →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
      <div
        className={`${baseClasses} p-4`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={`Карточка контрагента ${contractor.name}`}
      >
        <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {contractor.name}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span>ИНН: {contractor.inn}</span>
            <span>ОГРН: {contractor.ogrn}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 ml-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contractor.status)}`}>
            {getStatusText(contractor.status)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRatingColor(contractor.rating.level)}`}>
            {contractor.rating.score}/100
          </span>
        </div>
        </div>

        {showDetailedInfo && contractor.address && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{contractor.address}</p>
        </div>
      )}

        {showDetailedInfo && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">
            Зарегистрирован: {formatDate(contractor.registrationDate || null)}
          </p>
        </div>
        )}

        <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Надежность:</span>
          <span className="text-xs font-semibold text-gray-900">{contractor.rating.score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              contractor.rating.level === 'high' ? 'bg-green-500' :
              contractor.rating.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${contractor.rating.score}%` }}
          />
        </div>
        </div>

        {onClick && (
        <div className="flex justify-end">
          <button
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Подробнее →
          </button>
        </div>
      )}
    </div>
  );
}
