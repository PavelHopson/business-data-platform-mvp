export interface SearchParams {
  query: string;
  type?: 'company' | 'individual' | 'all';
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  region?: string;
  inn?: string;
  ogrn?: string;
  status?: 'active' | 'inactive' | 'all';
}

export interface SearchResult {
  id: string;
  name: string;
  inn: string;
  ogrn: string;
  status: 'active' | 'inactive';
  address: string;
  registrationDate: string;
  rating: {
    score: number;
    level: 'low' | 'medium' | 'high';
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export class SearchAPI {
  private baseURL: string;
  private apiKey?: string;
  private timeout: number;

  constructor(baseURL: string = 'https://api.example.com/v1', apiKey?: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  private validateSearchParams(params: SearchParams): string[] {
    const errors: string[] = [];

    if (!params.query || params.query.trim().length === 0) {
      errors.push('Поисковый запрос не может быть пустым');
    }

    if (params.query && params.query.length < 2) {
      errors.push('Поисковый запрос должен содержать минимум 2 символа');
    }

    if (params.filters?.inn && !this.validateINN(params.filters.inn)) {
      errors.push('Неверный формат ИНН');
    }

    if (params.filters?.ogrn && !this.validateOGRN(params.filters.ogrn)) {
      errors.push('Неверный формат ОГРН');
    }

    if (params.page && params.page < 1) {
      errors.push('Номер страницы должен быть больше 0');
    }

    if (params.limit && (params.limit < 1 || params.limit > 100)) {
      errors.push('Количество результатов должно быть от 1 до 100');
    }

    return errors;
  }

  private validateINN(inn: string): boolean {
    const innRegex = /^\d{10}$|^\d{12}$/;
    return innRegex.test(inn);
  }

  private validateOGRN(ogrn: string): boolean {
    const ogrnRegex = /^\d{13}$|^\d{15}$/;
    return ogrnRegex.test(ogrn);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private async handleHttpError(response: Response): Promise<ApiError> {
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    let errorCode = 'UNKNOWN_ERROR';

    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
      errorCode = errorData.error?.code || errorCode;
      } catch {
      switch (response.status) {
        case 400:
          errorMessage = 'Неверный запрос';
          errorCode = 'BAD_REQUEST';
          break;
        case 401:
          errorMessage = 'Необходима авторизация';
          errorCode = 'UNAUTHORIZED';
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = 'Эндпоинт не найден';
          errorCode = 'NOT_FOUND';
          break;
        case 422:
          errorMessage = 'Ошибка валидации данных';
          errorCode = 'VALIDATION_ERROR';
          break;
        case 429:
          errorMessage = 'Превышен лимит запросов';
          errorCode = 'RATE_LIMIT_EXCEEDED';
          break;
        case 500:
          errorMessage = 'Внутренняя ошибка сервера';
          errorCode = 'INTERNAL_SERVER_ERROR';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Сервис временно недоступен';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
      }
    }

    return {
      code: errorCode,
      message: errorMessage,
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  }

  async search(params: SearchParams): Promise<ApiResponse<SearchResponse>> {
    try {
      const validationErrors = this.validateSearchParams(params);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validationErrors.join(', '),
            details: { validationErrors },
          },
        };
      }

      const requestBody = {
        query: params.query.trim(),
        region: params.filters?.region || "",
        status: params.filters?.status || "",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseURL}/search`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await this.handleHttpError(response);
          return {
            success: false,
            error,
          };
        }

        const data = await response.json();
        
        if (!data.success) {
          return {
            success: false,
            error: data.error || {
              code: 'API_ERROR',
              message: 'Сервер вернул ошибку',
            },
          };
        }

        return {
          success: true,
          data: data.data,
        };

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            return {
              success: false,
              error: {
                code: 'TIMEOUT',
                message: 'Превышено время ожидания ответа',
              },
            };
          }
        }
        
        throw fetchError;
      }

    } catch (error) {
      let errorMessage = 'Произошла неизвестная ошибка';
      let errorCode = 'UNKNOWN_ERROR';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
        errorCode = 'NETWORK_ERROR';
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Ошибка парсинга ответа сервера';
        errorCode = 'PARSE_ERROR';
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details: {
            originalError: error instanceof Error ? error.message : String(error),
          },
        },
      };
    }
  }

  async getContractorDetails(id: string): Promise<ApiResponse<SearchResult>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseURL}/contractors/${id}`, {
          method: 'GET',
          headers: this.getHeaders(),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await this.handleHttpError(response);
          return {
            success: false,
            error,
          };
        }

        const data = await response.json();
        
        return {
          success: true,
          data: data.data,
        };

      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Ошибка при получении данных контрагента',
          details: {
            originalError: error instanceof Error ? error.message : String(error),
          },
        },
      };
    }
  }
}

export const searchAPI = new SearchAPI(
  process.env.NEXT_PUBLIC_API_BASE_URL ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1` : 'http://localhost:8000/v1',
  undefined,
  10000
);

