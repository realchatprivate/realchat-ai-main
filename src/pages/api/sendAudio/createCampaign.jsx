import { callDialerApi } from './api'

export default async function runCreateCampaign ({
  phonebook,
  survey,
  audio,
  userId
}) {
  try {
    const data = {
      name: Date.now().toString(),
      voicemail: true,
      agent_dial_rate: 1.2,
      object_id: survey,
      user: `/rest-api/users/${userId}/`,
      status: 1,
      phonebook: [phonebook],
      xfer_gateway: 'http://dialer.realchat.ai/rest-api/gateway/2/',
      aleg_gateway: 'http://dialer.realchat.ai/rest-api/gateway/2/',
      voicemail: true,
      voicemail_audiofile: `http://dialer.realchat.ai/rest-api/audio-files/${audio}/`,
      voicemail_tts: null
    }

    const response = await callDialerApi('campaigns/', data)

    return response
  } catch (err) {
    console.log('create campaign failed')
    throw err.message
  }
}
