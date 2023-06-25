import axios from 'axios';
import { S3 } from 'aws-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function textToSpeech(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const API_KEY = process.env.API_KEY;
    const VOICE_ID = 'Lfush8lZN9F1xAjh8pqx';
    const { prompts } = req.body;

    // Configure AWS S3
    const s3 = new S3({
      region: "us-east-2",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    try {
      const responseArray = [];
      let index = 0;

      for (const prompt of prompts) {
        const options = {
          method: 'POST',
          url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
          headers: {
            accept: 'audio/mpeg',
            'content-type': 'application/json',
            'xi-api-key': API_KEY,
          },
          data: {
            text: prompt,
          },
          responseType: 'arraybuffer' as const,
        };

        const speechDetails = await axios.request(options);

        const mytime = Date.now()
        // UPLOAD TO S3
        const params = {
          Bucket: 'realchat-mp3s',
          Key: `audio-${mytime}.mp3`, // provide a unique key for each file
          ContentType: 'audio/mpeg',
          Body: speechDetails.data,
        };
        
        // Upload to S3

        try {
          const s3Response = await s3.upload(params).promise();
          console.log('File uploaded successfully:', s3Response);
          console.log(s3Response.Location);
          responseArray.push(s3Response.Location); // store the URL of the uploaded file
          console.log(responseArray);
          index++;
          console.log("INDEX: " + index.toString());
        } catch (error) {
          console.error('An error occurred while uploading the file to S3:', error);
        }

        // const randomTime = Math.floor(Math.random() * 5000) + 1000; // Generate a random time between 1000ms and 6000ms (1-6 seconds)

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      res.status(200).json(responseArray);
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

