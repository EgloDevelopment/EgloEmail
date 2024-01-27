import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import "@/styles/globals.css"
 
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Eglo</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 
export default MyApp