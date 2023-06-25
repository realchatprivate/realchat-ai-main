import '@/styles/globals.css'
import * as React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app'
import router, { useRouter } from 'next/router';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      < Component {...pageProps} />
      {/* <Analytics /> */}
    </ChakraProvider >
  )
}
