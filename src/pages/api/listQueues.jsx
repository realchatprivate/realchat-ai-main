import { axiosInstance } from './sendAudio/api'

export default async function handler (req, res) {
  console.log('list queues called')
  try {
    const listQueuesResponse = await axiosInstance.get(
      'queue/', {
        auth: {
          username: process.env.DIALERAI_BASIC_AUTH_LOGIN,
          password: process.env.DIALERAI_BASIC_AUTH_PASSWORD
        },
      }
    );
    res.status(200).json(listQueuesResponse.data)
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.statusText})
  }
}
