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


const MyTicket = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;

  const [ticketId, setTicketId] = useState(0)

  useEffect(() => {
    if (account.length === 0) return
    const getUserTicket = async () => {
      const _ticketId = await contractRead.buyerToTicket(account)
      setTicketId(_ticketId.toNumber())
    }
    getUserTicket()

  }, [account])

  const onClickHandler = (e) => {
    // check in event.
    console.log(e)
  }


  return (
    <Layout title="My Ticket">
      <Box
        sx={{
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          '& > :not(style)': {
            m: 1,
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: 400,
            width: 400,
          },
        }}
      >
        <Paper elevaion={3}>
          <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>My Ticket</Typography>
          {
            ticketId === 0 ?
              (
                <Typography alignContent='center' textAlign='center' marginTop='2rem'>You have not bought ticket yet!</Typography>
              )
              : (<>
                {/* Get data from IPFS */}
                <Typography alignContent='center' textAlign='center' marginTop='2rem'>TICKET IS HERE!!</Typography>

                <Box textAlign='center' margin='1rem'>

                  <Button variant="outlined" size="large" onClick={onClickHandler} style={{ marginTop: '1rem' }}>
                    CHECK IN
                  </Button>
                </Box>
              </>
              )
          }


        </Paper>


      </Box>


    </Layout>
  )
}

export default MyTicket