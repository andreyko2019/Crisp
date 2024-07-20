type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Добавляем метод PATCH в тип HttpMethod

type FetchOptions<TBody = undefined> = {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: TBody;
  limit?: number;
};

type FetchError = {
  message: string;
  status?: number;
};

type FetchResponse<T> = {
  data: T | null;
  error: FetchError | null;
};

export const fetchComposable = async <TResponse, TBody = undefined>(url: string, options: FetchOptions<TBody> = {}): Promise<FetchResponse<TResponse>> => {
  const { method = 'GET', headers = {}, body, limit } = options;

  const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!validMethods.includes(method)) {
    return {
      data: null,
      error: { message: `Invalid HTTP method: ${method}`, status: 400 },
    };
  }

  const urlWithLimit = limit ? `${url}?limit=${limit}` : url;

  try {
    const response = await fetch(urlWithLimit, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw { message: `HTTP error! status: ${response.status}`, status: response.status };
    }

    const data: TResponse = await response.json();
    return { data, error: null };
  } catch (error) {
    const fetchError: FetchError = {
      message: (error as Error).message,
      status: (error as any).status,
    };
    return { data: null, error: fetchError };
  }
};
