import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import FormData from 'form-data'

const username = 'leporecolby5@gmail.com' // replace with your actual username
const password = 'bFc3jG9Py' // replace with your actual password
const hostname_ip = 'autodialer.dialer.ai' // replace with your actual hostname or IP

const url =
  'https://realchat-mp3s.s3.us-east-2.amazonaws.com/audio-1688395715406.mp3'
const filePath = path.resolve('./', path.basename(url))

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

const uploadFile = async filePath => {
  // Read the file from filesystem
  const fileStream = fs.createReadStream(filePath)

  // Create a form
  const form = new FormData()
  form.append('name', 'audio created from API')
  form.append('audio_file', fileStream)
  form.append('user_id', '1701')

  // Calculate Base64 for Authorization
  const base64Credentials = Buffer.from(
    `${process.env.DIALERAI_BASIC_AUTH_LOGIN}:${process.env.DIALERAI_BASIC_AUTH_PASSWORD}`
  ).toString('base64')

  // Prepare the form data for the fetch body and get the content-type header
  const formHeaders = form.getHeaders()

  // Make the API request
  const response = await fetch(
    'https://autodialer.dialer.ai/rest-api/audio-files/',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`,
        ...formHeaders
      },
      body: form
    }
  )

  // Read the API response
  return await response.json()
}

export default async function handler (req, res) {
  try {
    await downloadFile(url, filePath)
    const result = await uploadFile(filePath)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// curl -u leporecolby5@gmail.com:bFc3jG9Py -H ‘Accept: application/json’ –request POST http://autodialer.dialer.ai/rest-api/audio-files/ –form ‘name=”audio created from API”’ –form ‘audio_file=@”/audio-1688395715406.mp3”’ –form ‘user_id=”1701”’
