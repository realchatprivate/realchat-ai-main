import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://dialer.realchat.ai/rest-api/',
  headers: { Accept: 'application/json' },
  maxRedirects: 0
})

export const callDialerApi = async (endpoint, body, headers = {}, dialerLogin, dialerToken) => {
  console.log('credentials')
  console.log(dialerLogin)
  console.log(dialerToken)
  const response = await axiosInstance.post(endpoint, body, { headers, auth: {
    username: dialerLogin,
    password: dialerToken
  } })
  return response.data
}
