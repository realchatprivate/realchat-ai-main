import Papa from "papaparse";

import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Checkbox,
  Collapse,
  Icon,
  Link,
  Center,
  Input,
  Container, 
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Circle,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';


export default function Home() {
  const [array, setArray] = useState([]);
  const [prompt, setPrompt] = useState("Hi {FirstName} {LastName}! I heard you like {Interests}. Your number is {Phone}.");
  const [mp3, setMp3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [mp3Loaded, setMp3Loaded] = useState(false);
  const [forwardNumber, setForwardNumber] = useState('')
  const handleChange = (event) => setForwardNumber(event.target.value)


  const onChangeHandler = (event) => {
    setFile(event.target.files[0]);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setArray(results.data);
        console.log(results.data);
      },
    });
  };

  const parsePrompt = (prompt, person) => {
    let parsedPrompt = prompt;
    for (let key in person) {
      const placeholder = `{${key}}`;
      if (parsedPrompt.includes(placeholder)) {
        parsedPrompt = parsedPrompt.replaceAll(placeholder, person[key]);
      }
    }
    return parsedPrompt;
  };

  const fetchRequest = async (file) => {
    setLoading(true);
    const parsedPrompts = array.map(person => parsePrompt(prompt, person));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompts: parsedPrompts }),
    };

    try {
      const request = await fetch("/api/eleven", requestOptions);
      if (!request.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await request.json();
      console.log(data);
      setMp3(data);
      setLoading(false);
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      setLoading(false);
    }
  };

  const handlePlay = (src) => {
    const tmp = new Audio(src);
    tmp.play();
  };

  const [err, setErr] = useState("");


  const sendCampaignUrl = async ({mp3, phone}) => {
    if (!forwardNumber) {
      console.log("No forward number")
      setErr("No forward number")
      return;
    }
    console.log(array);
    console.log(forwardNumber);
    console.log(mp3);
    console.log(phone);
    var formdata = new FormData();
    formdata.append("c_uid", process.env.C_UID);
    formdata.append("c_password", process.env.C_PASSWORD);
    formdata.append("c_callerID", forwardNumber);
    formdata.append("c_phone", phone);
    formdata.append("c_url", mp3);
    formdata.append("c_audio", "mp3");
    formdata.append("c_date", "now");
    formdata.append("c_method", "new_campaign");
    formdata.append("mobile_only", "1");

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    
    // fetch("https://www.slybroadcast.com/gateway/vmb.adv.json.php", requestOptions)
    
    fetch("https://cors-anywhere.herokuapp.com/https://www.slybroadcast.com/gateway/vmb.adv.json.php", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <Box paddingY={20} className="w-3/4 mx-auto">
      <Text className="text-red-500 text-4xl text-center font-bold pb-5">RealChat.ai</Text>
      <form className="input-field">
        <Textarea 
          onChange={(event) => setPrompt(event.target.value)}
          value={prompt}
          placeholder="Hi {FirstName}! How are you? I'm calling to see if you..."
          rows={5}
          cols={48}
        />
        <div className="py-5">
            <label className="file-input" style={{ width: '100%' }}>
              <input
                  type="file"
                  name="file"
                  accept=".csv"
                  className="hidden"
                  onChange={onChangeHandler}
                  style={{ width: '100%' }}
              />
              <div className="my-5 text-red-500 flex items-center text-center justify-center p-4 bg-input border-dotted border-dotted-color border-2 rounded-md" style={{ borderWidth: '2px', borderStyle: 'dotted', borderColor: 'currentColor', borderRadius: '0.5rem', width: '100%' }}>
                  <span>{file ? file.name : 'Upload your contacts.csv'}</span>
              </div>
          </label>
          <Button
            type="button"
            colorScheme="red"
            className="w-full"
            {...(array.length === 0 && { disabled: true })}
            onClick={() => fetchRequest({ prompt: prompt, users: array })}
          >
            {loading ? 'Loading...' : 'Generate Speech'}
          </Button>
        </div>
      </form>
      <Input
        value={forwardNumber}
        onChange={handleChange}
        placeholder='Number to forward to'
        className="my-3"
      />
      {/* <Text>{forwardNumber}</Text> */}
      <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            {array.length > 0 && Object.keys(array[0]).map((columnName, index) => (
              <Th key={index} style={{ textTransform: 'none' }}>{columnName.toString()}</Th>
            ))}
            {array.length > 0 && <Th>MP3</Th>}
            {array.length > 0 && <Th>Send Voicemail</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {array.map((person, index) => (
            <Tr key={index}>
              {Object.keys(person).map((key, keyIndex) => (
                <Td key={keyIndex}>{person[key]}</Td>
              ))}
              {mp3.length !== 0 && 
                <Td>
                <Button
                  className="w-full"
                  colorScheme={mp3.length !== 0 && "red"}
                  onClick={() => handlePlay(mp3[index])}
                >
                  PLAY
                </Button>
              </Td>
              }
              {mp3.length !== 0 && 
                <Td>
                  <Button className="w-full" 
                    colorScheme='red'
                    onClick={() => sendCampaignUrl({mp3: mp3[index], phone: person['Phone']})}>
                      SEND CAMPAIGN
                  </Button>
                  {/* <Checkbox defaultChecked></Checkbox> */}
                </Td>
              }
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
    {err != "" && 
        <Text className="pt-10 text-center w-full mx-auto text-red-500 font-bold text-3xl">Error: {err}</Text>
    }
    </Box>
  );
}
