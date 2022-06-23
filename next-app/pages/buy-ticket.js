import React, { useContext } from 'react'
import { Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { Store } from "utils/Store";

const BuyTicket = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store);

  const onClickHandler = (event) => {
    router.push('/buy-ticket')
  }
    return (
    <Layout title="mytitle">
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
        <Paper elevaion={3} alignItems='center' justifyContent='center'>
          <Typography variant='h6' alignContent='center' textAlign='center' margin='2rem'>Coming Event</Typography>
          <Typography variant='h4' alignContent='center' textAlign='center'>Super Bowl!</Typography>
          <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem', margin: '0.25rem' }}>@ Glendale, Arizona</Typography>
          <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem', margin: '0.25rem' }}>February 12</Typography>
          
          <Box textAlign='center' margin='3rem'>
            <Button variant="outlined" size="large" alignItems='center' justifyContent='center' onClick={onClickHandler}>
              Buy a Ticket!
            </Button>
          </Box>
        </Paper>
      </Box>

    </Layout>
  )
}

export default BuyTicket