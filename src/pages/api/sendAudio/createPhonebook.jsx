import { callDialerApi } from './api'

export default async function runCreatePhonebook ({
  firstName,
  lastName,
  phone,
  userId
}) {
  try {
    const phonebookBody = {
      name: Date.now().toString(),
      user: `/rest-api/users/${userId}/`
    }

    const createPhonebookResponse = await callDialerApi(
      'phonebook/',
      phonebookBody
    )

    const contactBody = {
      contact: phone,
      full_name: `${firstName} ${lastName}`,
      phonebook: createPhonebookResponse.url,
      additional_vars: {
        transfer_number: '0000001'
      }
    }

    await callDialerApi('contact/', contactBody)

    return createPhonebookResponse
  } catch (err) {
    console.log('create phonebook failed')
    throw err.message
  }
}
