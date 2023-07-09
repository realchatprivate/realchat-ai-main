const axios = require('axios')
export default async function handler (req, res) {
  try {
    //   const { firstName, lastName, mp3Url, dialerLogin, dialerToken } = req.body

    //   const fileName = `${firstName} ${lastName}`

    //   const fileBuffer = await downloadFile(mp3Url)
    //   const result = await uploadFile(
    //     fileBuffer,
    //     fileName,
    //     dialerLogin,
    //     dialerToken
    //   )

    // const data = {
    //   name: 'mycampaign01',
    //   description: '',
    //   callerid: '1239876',
    //   startingdate: '2017-01-01 13:13:33',
    //   expirationdate: '2017-06-14 13:13:33',
    //   frequency: '10',
    //   max_aleg: 28,
    //   max_xfer: 12,
    //   dial_method: 2,
    //   agent_dial_rate: 1.2,
    //   callmaxduration: '50',
    //   maxretry: '3',
    //   intervalretry: '3000',
    //   calltimeout: '45',
    //   aleg_gateway: '/rest-api/gateway/2/',
    //   sms_gateway: '',
    //   object_id: '101',
    //   extra_data: '2000',
    //   voicemail: 'True',
    //   amd_behavior: '1',
    //   voicemail_audiofile: '',
    //   dnc: '',
    //   user: '/rest-api/users/1/',
    //   phonebook: ['/rest-api/phonebook/3/'],
    //   daily_start_time: '00:00:00',
    //   daily_stop_time: '23:59:59',
    //   callerid_group: '/rest-api/callerid_group/7/'
    // }


    const data = {
        name: Date.now().toString(),
        voicemail: true,
        agent_dial_rate: 1.2,
        object_id: '15',
        user: '/rest-api/users/1/',
        status: 1,
        callerid: '+6034848251',
        phonebook: [
            "http://dialer.realchat.ai/rest-api/phonebook/3/"
        ],
        xfer_gateway: "http://dialer.realchat.ai/rest-api/gateway/2/",
        aleg_gateway: "http://dialer.realchat.ai/rest-api/gateway/2/",
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
      }).catch((error) => {
        console.error(error.response.data)
        res.status(500).json({ error: error.message })
        return;
      })

    res.status(200).json(response.data)
  } catch (error) {
  }
}
