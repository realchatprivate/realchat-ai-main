import { callDialerApi } from './api'

export default async function runCreateSurvey ({
  audio,
  userId,
  queue
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
      type: '12',
      audiofile: ``,
      question: 'Put in queue',
      survey: createSurveyResponse.url,
      queue: queue
    }

    await callDialerApi('section-template/', createSurveySectionBody)

    return createSurveyResponse
  } catch (err) {
    console.log('create survey failed')
    throw err.message
  }
}
