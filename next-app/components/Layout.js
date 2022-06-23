import React, { useEffect, useState, useContext } from 'react'
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import TopBar from './TopBar'
import { Store } from "utils/Store";
import Web3Modal from 'web3modal';

const Layout = ({title, children}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(true);
  const {
    account,
  } = state;
  const [walletConnected, setWalletConnected] = useState(false);


  const resetState = () => {
    dispatch({ type: 'RESET_ACCOUNT' });
    dispatch({ type: 'RESET_PROVIDER' });
    dispatch({ type: 'RESET_SIGNER' });
    dispatch({ type: 'RESET_NETWORK' });
    console.log('RESET STATE..');
  };


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