import * as https from 'https'
import FormData from 'form-data'
import axios from 'axios'

const downloadFile = url =>
  new Promise((resolve, reject) => {
    let data = []

    https
      .get(url, res => {
        res
          .on('data', chunk => {
            data.push(chunk)
          })
          .on('end', () => {
            resolve(Buffer.concat(data))
          })
      })
      .on('error', err => {
        reject(err.message)
      })
  })

const uploadFile = async (fileBuffer, fileName, dialerLogin, dialerToken) => {
  const form = new FormData()
  form.append('name', fileName)
  form.append('audio_file', fileBuffer, { filename: fileName })

  const base64Credentials = Buffer.from(
    `${dialerLogin}:${dialerToken}`
  ).toString('base64')

  const response = await axios({
    method: 'post',
    url: 'https://dialer.realchat.ai/rest-api/audio-files/',
    data: form,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${base64Credentials}`,
      ...form.getHeaders()
    },
    maxRedirects: 0
  })

  return response.data
}

export default async function handler (req, res) {
  try {
    const { firstName, lastName, mp3Url, dialerLogin, dialerToken } = req.body

    const fileName = `${firstName} ${lastName}`

    const fileBuffer = await downloadFile(mp3Url)
    const result = await uploadFile(
      fileBuffer,
      fileName,
      dialerLogin,
      dialerToken
    )
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
