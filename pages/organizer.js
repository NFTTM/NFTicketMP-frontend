import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { Typography, Box, Paper, Button, TextField, InputLabel, MenuItem, FormControl, Select, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/Layout'
import { Store } from "utils/Store";
import { ethers } from 'ethers';
import { contractAddress, defaultProvider, contractRead, backendUrl } from "utils/const"
import abi from 'utils/contracts/abi.json'

const Organizer = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories, adminAddress } = state;

  const [loaded, setLoaded] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);

  useEffect(() => {
    if (adminAddress.length === 0 || account.length == 0) {
      setLoaded(false)
      setAdminConnected(false)
    }
    if (adminAddress === account) {
      enqueueSnackbar('Welcome to the admin dashboard', {variant: 'success'})
      setAdminConnected(true)
    } else {
      enqueueSnackbar('Sorry, you are not admin of the contract', {variant: 'error'})
      setAdminConnected(false)
    }
  }, [account, adminAddress])

  return (
    <Layout title="Organizer">
      {
        adminConnected && loaded ? <>
          <Typography>Welcome to use Admin panel</Typography>
        </> : <>
        <Typography>You must connect with Admin Account to use the panel.</Typography>

        </>
      }


    </Layout>
  )
}

export default Organizer