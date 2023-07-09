const axios = require('axios')
import runUploadAudio from './uploadAudio'

export default async function handler (req, res) {
    try {
      const { firstName, lastName, mp3Url, dialerLogin, dialerToken } = req.body
  
      const uploadAudioAnswer = await runUploadAudio({ firstName, lastName, mp3Url, dialerLogin, dialerToken})

      console.log(`upload audio answer `)
      console.log(uploadAudioAnswer)

      res.status(200).json(uploadAudioAnswer)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  