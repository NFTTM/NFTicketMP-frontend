import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/Layout'
import { Store } from "utils/Store";
import { defaultProvider, contractRead } from "utils/const"

const Home = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [eventDate, setEventDate] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [loaded, setLoaded] = useState(false)


  useEffect(() => {

    const init = async () => {
      const eventDetails = await contractRead.eventDetails()
      const _eventDate = ethers.utils.parseBytes32String(eventDetails.eventDate)
      const _eventName = ethers.utils.parseBytes32String(eventDetails.eventName)
      const _eventTime = ethers.utils.parseBytes32String(eventDetails.eventTime)
      // console.log(eventDate,eventName, eventTime)
      setEventDate(_eventDate)
      setEventName(_eventName)
      setEventTime(_eventTime)
      setLoaded(true)
    }
    init()
  }, [])


  const onClickHandler = (event) => {
    router.push('/buy-ticket')
  }

  return (
    <Layout title="Coming Event">

      {loaded &&
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
            <Typography variant='h6' alignContent='center' textAlign='center' margin='2rem'>Coming Event</Typography>
            <Typography variant='h4' alignContent='center' textAlign='center'>{eventName}</Typography>
            <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem', margin: '0.25rem' }}>{eventDate}</Typography>
            <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem;', margin: '0.25rem' }}>{eventTime}</Typography>

            <Box textAlign='center' margin='3rem'>
              <Button variant="outlined" size="large" onClick={onClickHandler}>
                Buy a Ticket!
              </Button>
            </Box>
          </Paper>
        </Box>
      }


    </Layout>
  )
}

export default Home