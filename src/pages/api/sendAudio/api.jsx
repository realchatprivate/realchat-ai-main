import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://dialer.realchat.ai/rest-api/',
  headers: { Accept: 'application/json' },
  auth: {
    username: process.env.DIALERAI_BASIC_AUTH_LOGIN,
    password: process.env.DIALERAI_BASIC_AUTH_PASSWORD
  },
  maxRedirects: 0
})

export const callDialerApi = async (endpoint, body, headers = {}) => {
  const response = await axiosInstance.post(endpoint, body, { headers })
  return response.data
}
