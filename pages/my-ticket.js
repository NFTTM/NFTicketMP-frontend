import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import Image from 'next/image'
import { Typography, Box, Paper, Button, TextField, InputLabel, MenuItem, FormControl, Select, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/Layout'
import { Store } from "utils/Store";
import { ethers } from 'ethers';
import { ipfsEndpoint, contractAddress, defaultProvider, contractRead, backendUrl } from "utils/const"
import abi from 'utils/contracts/abi.json'


const MyTicket = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;

  const [ticketId, setTicketId] = useState(0)
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState('')
  const [vipLevel, setVipLevel] = useState('')
  const [passportId, setPassportId] = useState('');
  const [imageUri, setImageUri] = useState('')

  useEffect(() => {
    if (account.length === 0) return
    const getUserTicket = async () => {
      setLoaded(false)
      const _ticketId = await contractRead.buyerToTicket(account)
      setTicketId(_ticketId.toNumber())
      // check checkIn status
      const checkedInStatus = await contractRead.checkedIn(account)
      setIsCheckedIn(checkedInStatus)
      setLoaded(true)

      // Compatible issue

      try {
        const allTickets = await axios.get(`${backendUrl}ticket/`)
        const _allTickets = Object.entries(allTickets.data)
        console.log("all tickets:: ", _allTickets)
        const myTicketArr = _allTickets.filter(item => item?.[1]?.ticketdata?.address === account)
        console.log("myTicketArr: ", myTicketArr)
        if (myTicketArr.length === 0) return
        const myTicket = myTicketArr[0]
        const _name = myTicket[1].ticketdata.name
        const _vipLevel = myTicket[1].ticketdata.ticketType
        const _passportId = myTicket[1].ticketdata.id

        setName(_name)
        setVipLevel(_vipLevel)
        setPassportId(_passportId)
        const responseDataIpfsHash = await axios.get(`${backendUrl}ticket/${_passportId}`)
        const ipfsData = responseDataIpfsHash.data
        console.log("ipfsData:", ipfsData)
        const imageIpfsUri = myTicket[1].imageIpfs.path
        setImageUri(imageIpfsUri)
        console.log("imageIpfsUri", imageIpfsUri)
        enqueueSnackbar("Fetch Ticket Info Success", { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Fetch Ticket Info Error: ${error}`, { variant: 'error' })
      }
    }
    getUserTicket()
  }, [account])

  const onClickHandler = (e) => {

    const signMsgAndCheckin = async () => {
      // Sign a Message
      const msg = {
        address: account,
        requestCheckin: true
      }
      const msgString = JSON.stringify(msg)
      const signedHashForCheckin = await signer.signMessage(msgString)
      console.log("check in hash is :", signedHashForCheckin)
      const constructed = {
        address: account,
        requestCheckin: true,
        signedHashForCheckin: signedHashForCheckin
      }
      console.log(constructed)
      const response = await axios.post(`${backendUrl}ticket/check-in`, constructed)
      if (response.data === true) {
        enqueueSnackbar('Successfully Checked in', { variant: 'success' })
        setIsCheckedIn(true)
        return true
      }
      enqueueSnackbar('Signature verify failed, Cannot check in!', { variant: 'error' })
      return false
  }
   
    signMsgAndCheckin()
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
            height: 600,
            width: 400,
          },
        }}
      >
        {
          walletConencted && loaded ? (
            <Paper elevaion={3}>
              <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>My Ticket</Typography>
              {
                ticketId === 0 ?
                  (
                    <Typography alignContent='center' textAlign='center' marginTop='2rem'>You have not bought ticket yet!</Typography>
                  )
                  : (<>
                    <></>
                    <Image
                      src={`${ipfsEndpoint}${imageUri}`}
                      alt="Ticket"
                      width={500}
                      height={150}
                    />


                    <Typography alignContent='center' textAlign='center' marginTop='1rem'>Name ID: {name}</Typography>
                    <Typography alignContent='center' textAlign='center' marginTop='1rem'>Ticket ID: {ticketId}</Typography>
                    <Typography alignContent='center' textAlign='center' marginTop='1rem'>Ticket Type: {vipLevel}</Typography>
                    <Typography alignContent='center' textAlign='center' marginTop='1rem'>Passport ID: {passportId}</Typography>
                    <Box textAlign='center' margin='1rem'>

                      <Button variant="outlined" size="large" onClick={onClickHandler} style={{ marginTop: '1rem' }} disabled={isCheckedIn}>
                        {isCheckedIn ? 'ALREADY CHECKED IN' : 'CHECK IN NOW'}
                      </Button>
                    </Box>
                  </>
                  )
              }
            </Paper>
          ) : (
            <Paper elevaion={3}>
              <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>My Ticket</Typography>
              <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem' style={{ fontSize: '1rem' }}>Please Connect the Wallet</Typography>
            </Paper>
          )
        }



      </Box>


    </Layout>
  )
}

export default MyTicket