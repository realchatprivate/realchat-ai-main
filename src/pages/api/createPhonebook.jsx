const axios = require('axios')
export default async function runCreatePhonebook ({ dialerLogin, dialerToken, firstName, lastName, phone }) {
  try {
    const base64Credentials = Buffer.from(
      `${process.env.DIALERAI_BASIC_AUTH_LOGIN}:${process.env.DIALERAI_BASIC_AUTH_PASSWORD}`
    ).toString('base64')

    const phonebookBody = {
      name: Date.now().toString(),
      user: '/rest-api/users/1/'
    }

    const createPhonebookResponse = await axios({
      method: 'post',
      url: 'https://dialer.realchat.ai/rest-api/phonebook/',
      data: phonebookBody,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`
      },
      maxRedirects: 0
    })

    console.log(phone)
    console.log(createPhonebookResponse.data.url)

    const contactBody = {
        contact: phone,
        full_name: `${firstName} ${lastName}`,
        phonebook: createPhonebookResponse.data.url,
        additional_vars: {
          transfer_number: "0000001"
        }
      };
  
      const createContactResponse = await axios({
        method: 'post',
        url: 'https://dialer.realchat.ai/rest-api/contact/',
        data: contactBody,
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64Credentials}`
        },
        maxRedirects: 0
      })

    return createPhonebookResponse.data
  } catch (err) {
    console.log('create phonebook failed')
    throw err.message
  }
}

// curl -u root:5bo47cRTo16@ --dump-header - -H "Content-Type:application/json" -X POST --data '{"contact": "+34650787878", "full_name": "Areski Belaid", "phonebook": "/rest-api/phonebook/20/", "additional_vars": "{"transfer_number": "0000001"}"}' https://dialer.realchat.ai/rest-api/contact/
