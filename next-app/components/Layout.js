import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import TopBar from './TopBar'

const Layout = ({title, children}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport"
          content="initial-scale=1, width=device-width" />
      </Head>
      <TopBar />
      {children}
    </>
  )
}

export default Layout