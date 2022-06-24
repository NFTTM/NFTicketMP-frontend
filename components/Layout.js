import React, { useEffect, useState, useContext } from 'react'
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import TopBar from 'components/TopBar'
import { Store } from "utils/Store";
import Web3Modal from 'web3modal';

const Layout = ({title, children}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Head>
        <title>{title ? `${title} - NFTicket` : 'NFTicket' }</title>
        <meta name="viewport"
          content="initial-scale=1, width=device-width" />
      </Head>
      <TopBar />
      {children}
    </>
  )
}

export default Layout