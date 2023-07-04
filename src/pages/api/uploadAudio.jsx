import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import FormData from 'form-data'
import axios from 'axios'

const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, response => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(true)
        })
      })
      .on('error', err => {
        fs.unlink(dest, () => {})
        reject(err.message)
      })
  })

const uploadFile = async (filePath, fileName, dialerLogin, dialerToken) => {
  // Read the file from filesystem
  console.log(dialerLogin, dialerToken)
  const fileStream = fs.createReadStream(filePath)
  // Create a form
  const form = new FormData()
  form.append('name', fileName)
  form.append('audio_file', fileStream)

  // Calculate Base64 for Authorization
  const base64Credentials = Buffer.from(
    `${dialerLogin}:${dialerToken}`
  ).toString('base64')

  // Make the API request
  const response = await axios({
    method: 'post',
    url: 'https://dialer.realchat.ai/rest-api/audio-files/',
    data: form,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${base64Credentials}`,
      ...form.getHeaders()
    },
    maxRedirects: 0 // This will disable following redirects
  })

  return response.data

  // Read the API response
}

export default async function handler (req, res) {
  try {
    const { firstName, lastName, mp3Url, dialerLogin, dialerToken } = req.body

    console.log(firstName, lastName, mp3Url, dialerLogin, dialerToken)

    const fileName = `${firstName} ${lastName}`

    const filePath = path.resolve('./', path.basename(mp3Url))

    await downloadFile(mp3Url, filePath)
    const result = await uploadFile(filePath, fileName, dialerLogin, dialerToken)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// curl -u leporecolby5@gmail.com:bFc3jG9Py -H ‘Accept: application/json’ –request POST http://autodialer.dialer.ai/rest-api/audio-files/ –form ‘name=”audio created from API”’ –form ‘audio_file=@”/audio-1688395715406.mp3”’ –form ‘user_id=”1701”’
