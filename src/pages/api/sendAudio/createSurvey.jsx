import { callDialerApi } from './api'

export default async function runCreateSurvey ({
  audio,
  userId
}) {
  try {
    const createSurveyBody = {
      name: Date.now().toString(),
      user: `/rest-api/users/${userId}/`
    }

    const createSurveyResponse = await callDialerApi(
      'survey-template/',
      createSurveyBody
    )

    const createSurveySectionBody = {
      type: '1',
      audiofile: `http://dialer.realchat.ai/rest-api/audio-files/${audio}/`,
      question: 'Play audio',
      survey: createSurveyResponse.url,
      queue: null
    }

    await callDialerApi('section-template/', createSurveySectionBody)

    return createSurveyResponse
  } catch (err) {
    console.log('create survey failed')
    throw err.message
  }
}