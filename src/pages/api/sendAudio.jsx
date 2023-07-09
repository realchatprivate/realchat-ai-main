import runCreateAudio from './createAudio'
import runCreateSurvey from './createSurvey'
import runCreatePhonebook from './createPhonebook'
import runCreateCampaign from './createCampaign'

export default async function handler (req, res) {
  try {
    const { firstName, lastName, mp3Url, dialerLogin, dialerToken, phone } = req.body

    const uploadAudioResponse = await runCreateAudio({
      firstName,
      lastName,
      mp3Url,
      dialerLogin,
      dialerToken
    })
    const createSurveyResponse = await runCreateSurvey({
      dialerLogin,
      dialerToken
    })
    const createPhonebookResponse = await runCreatePhonebook({
      dialerLogin,
      dialerToken,
      firstName,
      lastName,
      phone
    })

    const regex = /\/(\d+)\//
    const match = createSurveyResponse.url.match(regex)
    const surveyId = match ? match[1] : null

    const createCampaignResponse = await runCreateCampaign({
      phonebook: createPhonebookResponse.url,
      survey: surveyId
    })

    console.log(`upload audio response `)
    console.log(uploadAudioResponse)
    console.log(`create survey response `)
    console.log(createSurveyResponse)
    console.log(`create phonebook response `)
    console.log(createPhonebookResponse)
    console.log(`create campaign response `)
    console.log(createCampaignResponse)

    res.status(200).json(createCampaignResponse)
  } catch (error) {
    res.status(500).json({ error })
  }
}
