import FormData from 'form-data'
import axios from 'axios'
import { callDialerApi } from './api'

const downloadFile = async url => {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer' // to handle binary data
    })

    return Buffer.from(response.data, 'binary')
  } catch (err) {
    console.log('download failed')
    console.log(err.message)
    throw err.message
  }
}


const uploadFile = async (fileBuffer, fileName, dialerLogin, dialerToken, userId) => {
  console.log(userId)
  const form = new FormData()
  form.append('name', fileName)
  form.append('audio_file', fileBuffer, { filename: `${fileName}.mp3` })

  try {
    const headers = {
      ...form.getHeaders(),
    }
    const response = await callDialerApi('audio-files/', form, headers, dialerLogin, dialerToken)

    return response
  } catch (err) {
    console.log('upload failed')
    console.log(err.message)
    throw err.message
  }
}

export default async function runCreateAudio ({
  firstName,
  lastName,
  mp3Url,
  dialerLogin,
  dialerToken,
  userId
}) {
  const fileName = `${Date.now()} ${firstName} ${lastName}`

  const fileBuffer = await downloadFile(mp3Url)
  const result = await uploadFile(
    fileBuffer,
    fileName,
    dialerLogin,
    dialerToken,
    userId
  )
  return result
}
