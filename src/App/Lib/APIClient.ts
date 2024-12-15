import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface IAppAPIError {
  code: string;
  message: string;
}

// todo add interceptors, default headers

export class APIClient {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create();
    this.axiosClient.defaults.baseURL =
      process.env.REACT_APP_PLAYGROUND_API_URL;
    //5 seconds before timeout
    this.axiosClient.defaults.timeout = 5000;
    this.axiosClient.defaults.withCredentials = true;
  }

  get http(): AxiosInstance | null {
    return this.axiosClient;
  }

  private toAPIError(error: unknown) {
    if (axios.isAxiosError<IAppAPIError>(error) && error.response) {
      //  // server error response
      if (error.response.status && error.response.status == 500) {
        if (error.response.data && error.response.data.code) {
          return {
            code: error.response.data.code,
            message: error.response.data?.message,
          } as IAppAPIError;
        }
      }
    }
    return error;
  }

  async get<T>(URL: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosClient
      .get(`${URL}`, options)
      .catch((err) => {
        throw this.toAPIError(err);
      });
    return response.data;
  }

  async post<T, R>(
    URL: string,
    payload: T,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.axiosClient
      .post<R>(`${URL}`, payload, options)
      .catch((err) => {
        throw this.toAPIError(err);
      });
    return response.data;
  }

  async patch<T, R>(URL: string, payload: T): Promise<R> {
    const response = await this.axiosClient
      .patch<R>(`${URL}`, payload)
      .catch((err) => {
        throw this.toAPIError(err);
      });
    return response.data;
  }

  async delete<T>(URL: string): Promise<T> {
    const response = await this.axiosClient.delete(`${URL}`).catch((err) => {
      throw this.toAPIError(err);
    });
    return response.data;
  }
}

export default new APIClient();

export function isApiError(error: unknown): error is IAppAPIError {
  return (
    typeof (<IAppAPIError>error).code != 'undefined' &&
    typeof (<IAppAPIError>error).message != 'undefined'
  );
}
