const axios = require('axios')
export default async function runCreateCampaign ({ phonebook, survey, audio }) {
  console.log("start creating campaign")
  console.log(phonebook)
  console.log(survey)
  console.log(audio)
  try {
    const data = {
      name: Date.now().toString(),
      voicemail: true,
      agent_dial_rate: 1.2,
      object_id: survey,
      user: '/rest-api/users/1/',
      status: 1,
      phonebook: [
          phonebook
      ],
      xfer_gateway: "http://dialer.realchat.ai/rest-api/gateway/2/",
      aleg_gateway: "http://dialer.realchat.ai/rest-api/gateway/2/",
      voicemail: true,
      voicemail_audiofile: `http://dialer.realchat.ai/rest-api/audio-files/${audio}/`,
      voicemail_tts: null,
    }


    const base64Credentials = Buffer.from(
        `${process.env.DIALERAI_BASIC_AUTH_LOGIN}:${process.env.DIALERAI_BASIC_AUTH_PASSWORD}`
      ).toString('base64')

    const response = await axios({
        method: 'post',
        url: 'https://dialer.realchat.ai/rest-api/campaigns/',
        data: data,
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64Credentials}`
        },
        maxRedirects: 0
      })

    return response.data
  } catch (err) {
    console.log('create campaign failed')
    throw err.message
  }
}
