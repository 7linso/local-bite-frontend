import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

export const api = axios.create({
    baseURL: BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
    (res) => res.data,
    (error) => {
        const status = error?.response?.status ?? 0
        const data = error?.response?.data ?? { message: error.message ?? 'Request failed' }
        return Promise.reject({ status, data })
    }
)
