import axios, { type AxiosInstance } from 'axios'

const BASE = import.meta.env.VITE_API_URL

interface TypedApiInstance extends AxiosInstance {
  get<T = unknown>(url: string, config?: any): Promise<T>
  post<T = unknown>(url: string, data?: any, config?: any): Promise<T>
  put<T = unknown>(url: string, data?: any, config?: any): Promise<T>
  patch<T = unknown>(url: string, data?: any, config?: any): Promise<T>
  delete<T = unknown>(url: string, config?: any): Promise<T>
}

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
}) as TypedApiInstance

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error?.response?.status ?? 0
    const data =
      error?.response?.data ??
      { message: error.message ?? 'Request failed' }

    return Promise.reject({ status, data })
  }
)
