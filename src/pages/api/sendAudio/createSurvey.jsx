const axios = require('axios')
export default async function runCreateSurvey ({ dialerLogin, dialerToken, audio }) {
  try {
    const base64Credentials = Buffer.from(
      `${process.env.DIALERAI_BASIC_AUTH_LOGIN}:${process.env.DIALERAI_BASIC_AUTH_PASSWORD}`
    ).toString('base64')

    const createSurveyBody = {
      name: Date.now().toString(),
      user: '/rest-api/users/1/'
    }

    const createSurveyResponse = await axios({
      method: 'post',
      url: 'https://dialer.realchat.ai/rest-api/survey-template/',
      data: createSurveyBody,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`
      },
      maxRedirects: 0
    })

    const createSurveySectionBody = {
      type: '1',
      audiofile: `http://dialer.realchat.ai/rest-api/audio-files/${audio}/`,
      question: 'Play audio',
      survey: createSurveyResponse.data.url,
      queue: null
    }

    await axios({
      method: 'post',
      url: 'https://dialer.realchat.ai/rest-api/section-template/',
      data: createSurveySectionBody,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`
      },
      maxRedirects: 0
    })
  

    return createSurveyResponse.data
  } catch (err) {
    console.log('create survey failed')
    throw err.message
  }
}
