type FetchOptions<TBody = undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: TBody;
};

type FetchResponse<T> = {
  data: T | null;
  error: string | null;
};

export const fetchComposable = async <TResponse, TBody = undefined>(url: string, options: FetchOptions<TBody> = {}): Promise<FetchResponse<TResponse>> => {
  const { method = 'GET', headers = {}, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TResponse = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};
