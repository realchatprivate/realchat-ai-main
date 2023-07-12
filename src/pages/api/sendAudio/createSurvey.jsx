import { callDialerApi } from './api'

export default async function runCreateSurvey ({
  audio,
  userId,
  queue,
  dialerLogin,
  dialerToken
}) {
  try {
    const createSurveyBody = {
      name: Date.now().toString(),
      user: `/rest-api/users/${userId}/`
    }

    const createSurveyResponse = await callDialerApi(
      'survey-template/',
      createSurveyBody,
      {},
      process.env.DIALERAI_BASIC_AUTH_LOGIN,
      process.env.DIALERAI_BASIC_AUTH_PASSWORD
    )

    const createSurveySectionBody = {
      type: '12',
      audiofile: ``,
      question: 'Put in queue',
      survey: createSurveyResponse.url,
      queue: queue
    }

    await callDialerApi(
      'section-template/',
      createSurveySectionBody,
      {},
      process.env.DIALERAI_BASIC_AUTH_LOGIN,
      process.env.DIALERAI_BASIC_AUTH_PASSWORD
    )

    return createSurveyResponse
  } catch (err) {
    console.log('create survey failed')
    throw err.message
  }
}
