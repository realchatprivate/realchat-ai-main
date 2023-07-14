import '@/styles/globals.css'
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Script src="/fullstory.js" strategy="afterInteractive" />
      < Component {...pageProps} />
      {/* <Analytics /> */}
    </ChakraProvider >
  )
}
