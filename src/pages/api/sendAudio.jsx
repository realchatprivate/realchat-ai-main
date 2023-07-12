import runCreateAudio from './sendAudio/createAudio'
import runCreateSurvey from './sendAudio/createSurvey'
import runCreatePhonebook from './sendAudio/createPhonebook'
import runCreateCampaign from './sendAudio/createCampaign'

export default async function handler (req, res) {
  try {
    const {
      firstName,
      lastName,
      mp3Url,
      dialerLogin,
      dialerToken,
      phone,
      userId,
      queue
    } = req.body

    const uploadAudioResponse = await runCreateAudio({
      firstName,
      lastName,
      mp3Url,
      dialerLogin,
      dialerToken
    })
    const createSurveyResponse = await runCreateSurvey({
      dialerLogin,
      dialerToken,
      audio: uploadAudioResponse.id,
      userId,
      queue
    })
    const createPhonebookResponse = await runCreatePhonebook({
      dialerLogin,
      dialerToken,
      firstName,
      lastName,
      phone,
      userId
    })

    const regex = /\/(\d+)\//
    const match = createSurveyResponse.url.match(regex)
    const surveyId = match ? match[1] : null

    const createCampaignResponse = await runCreateCampaign({
      phonebook: createPhonebookResponse.url,
      survey: surveyId,
      audio: uploadAudioResponse.id,
      userId
    })

    res.status(200).json(createCampaignResponse)
  } catch (error) {
    res.status(500).json({ error })
  }
}
