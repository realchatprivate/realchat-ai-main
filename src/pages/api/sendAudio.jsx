import runUploadAudio from './uploadAudio'
import runCreateSurvey from './createSurvey'

export default async function handler (req, res) {
    try {
      const { firstName, lastName, mp3Url, dialerLogin, dialerToken } = req.body
  
      const uploadAudioAnswer = await runUploadAudio({ firstName, lastName, mp3Url, dialerLogin, dialerToken})
      const createSurverAnswer = await runCreateSurvey({ dialerLogin, dialerToken });

      console.log(`upload audio answer `)
      console.log(uploadAudioAnswer)
      console.log(`create survey answer `)
      console.log(createSurverAnswer)

      res.status(200).json(uploadAudioAnswer)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  