const axios = require('axios')
export default async function runCreateSurvey ({ dialerLogin, dialerToken }) {
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
      type: '7',
      audiofile: 'http://dialer.realchat.ai/rest-api/audio-files/47/',
      question: 'Play aydio',
      survey: createSurveyResponse.data.url,
      order: 1,
      queue: null
    }

    const createSectionResponse = await axios({
      method: 'post',
      url: 'https://dialer.realchat.ai/rest-api/section-template/',
      data: createSurveySectionBody,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`
      },
      maxRedirects: 0
    })

    console.log(createSurveyResponse.data.url)

    return createSurveyResponse.data
  } catch (err) {
    console.log('create survey failed')
    throw err.message
  }
}
