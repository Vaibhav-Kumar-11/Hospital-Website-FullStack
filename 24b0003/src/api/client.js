import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: BASE_URL,
})

// Attach the JWT access token (if any) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// On a 401, try to refresh the access token once and retry the original request.
let isRefreshing = false
let pendingRequests = []

function subscribeToRefresh(callback) {
  pendingRequests.push(callback)
}

function notifyRefreshed(newAccessToken) {
  pendingRequests.forEach((callback) => callback(newAccessToken))
  pendingRequests = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response ? error.response.status : null

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      // Another request already triggered a refresh; wait for it to finish.
      return new Promise((resolve, reject) => {
        subscribeToRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error)
            return
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
        refresh: refreshToken,
      })
      const newAccessToken = response.data.access
      localStorage.setItem('accessToken', newAccessToken)
      isRefreshing = false
      notifyRefreshed(newAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      isRefreshing = false
      notifyRefreshed(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return Promise.reject(refreshError)
    }
  }
)

export default apiClient
