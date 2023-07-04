import Papa from 'papaparse'

import React, { useState } from 'react'
import {
  Box,
  Text,
  Button,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'universal-cookie'

export default function Home () {
  const [array, setArray] = useState([])
  const [prompt, setPrompt] = useState(
    'Hi {FirstName} {LastName}! I heard you like {Interests}. Your number is {Phone}.'
  )
  const [mp3, setMp3] = useState([])
  const [mp3Uploaded, setMp3Uploaded] = useState([])
  const [loadingMp3Uploading, setLoadingMp3Uploading] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)

  const cookies = new Cookies()

  const onChangeHandler = event => {
    setFile(event.target.files[0])
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setArray(results.data)
        console.log(results.data)
      }
    })
  }

  const parsePrompt = (prompt, person) => {
    let parsedPrompt = prompt
    for (let key in person) {
      const placeholder = `{${key}}`
      if (parsedPrompt.includes(placeholder)) {
        parsedPrompt = parsedPrompt.replaceAll(placeholder, person[key])
      }
    }
    return parsedPrompt
  }

  const fetchRequest = async file => {
    setLoading(true)
    const parsedPrompts = array.map(person => parsePrompt(prompt, person))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompts: parsedPrompts })
    }

    try {
      const request = await fetch('/api/eleven', requestOptions)
      if (!request.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await request.json()
      console.log(data)
      setMp3(data)
      setLoading(false)
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
      setLoading(false)
    }
  }

  const handlePlay = src => {
    const tmp = new Audio(src)
    tmp.play()
  }

  const [err, setErr] = useState('')

  const sendCampaignUrl = async ({ mp3Url, firstName, lastName }) => {
    const dialerLogin = cookies.get('dialerLogin')
    const dialerToken = cookies.get('dialerToken')
    setLoadingMp3Uploading([...loadingMp3Uploading, mp3Url])
    const result = await axios.post('/api/uploadAudio', {
      mp3Url,
      firstName,
      lastName,
      dialerLogin,
      dialerToken
    })
    setLoadingMp3Uploading(loadingMp3Uploading.filter(item => item !== mp3Url))

    if (result.status === 200) {
      setMp3Uploaded([...mp3Uploaded, mp3Url])
    }
  }

  const goToDashboard = () => {
    window.open('https://dialer.realchat.ai/')
  }

  return (
    <Box paddingY={20} className='w-3/4 mx-auto'>
      <Text className='text-purple-500 text-4xl text-center font-bold pb-5'>
        RealChat.ai
      </Text>
      <form className='input-field'>
        <Textarea
          onChange={event => setPrompt(event.target.value)}
          value={prompt}
          placeholder="Hi {FirstName}! How are you? I'm calling to see if you..."
          rows={5}
          cols={48}
        />
        <div className='py-5'>
          <label className='file-input' style={{ width: '100%' }}>
            <input
              type='file'
              name='file'
              accept='.csv'
              className='hidden'
              onChange={onChangeHandler}
              style={{ width: '100%' }}
            />
            <div
              className='my-5 text-purple-500 flex items-center text-center justify-center p-4 bg-input border-dotted border-dotted-color border-2 rounded-md'
              style={{
                borderWidth: '2px',
                borderStyle: 'dotted',
                borderColor: 'currentColor',
                borderRadius: '0.5rem',
                width: '100%'
              }}
            >
              <span>{file ? file.name : 'Upload your contacts.csv'}</span>
            </div>
          </label>
          <Button
            type='button'
            colorScheme='purple'
            className='w-full'
            {...(array.length === 0 && { disabled: true })}
            onClick={() => fetchRequest({ prompt: prompt, users: array })}
          >
            {loading ? 'Loading...' : 'Generate Speech'}
          </Button>
        </div>
      </form>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              {array.length > 0 &&
                Object.keys(array[0]).map((columnName, index) => (
                  <Th key={index} style={{ textTransform: 'none' }}>
                    {columnName.toString()}
                  </Th>
                ))}
              {array.length > 0 && <Th>MP3</Th>}
              {array.length > 0 && <Th>ACTIONS</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {array.map((person, index) => (
              <Tr key={index}>
                {Object.keys(person).map((key, keyIndex) => (
                  <Td key={keyIndex}>{person[key]}</Td>
                ))}
                {mp3.length !== 0 && (
                  <Td>
                    <Button
                      className='w-full'
                      colorScheme={mp3.length !== 0 && 'purple'}
                      onClick={() => handlePlay(mp3[index])}
                    >
                      PLAY
                    </Button>
                  </Td>
                )}
                {mp3.length !== 0 && (
                  <Td>
                    {loadingMp3Uploading.includes(mp3[index]) ? (
                      <Button
                        className='w-full'
                        colorScheme='purple'
                        disabled={true}
                      >
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        className='w-full'
                        colorScheme='purple'
                        onClick={() => {
                          console.log(person['FirstName'])
                          console.log(person['LastName'])
                          console.log(mp3[index])
                          mp3Uploaded.includes(mp3[index])
                            ? goToDashboard()
                            : sendCampaignUrl({
                                mp3Url: mp3[index],
                                firstName: person['FirstName'],
                                lastName: person['LastName']
                              })
                        }}
                      >
                        {mp3Uploaded.includes(mp3[index])
                          ? 'Go To Dashboard'
                          : 'Upload Audio'}
                      </Button>
                    )}
                    {/* <Checkbox defaultChecked></Checkbox> */}
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {err != '' && (
        <Text className='pt-10 text-center w-full mx-auto text-purple-500 font-bold text-3xl'>
          Error: {err}
        </Text>
      )}
    </Box>
  )
}
