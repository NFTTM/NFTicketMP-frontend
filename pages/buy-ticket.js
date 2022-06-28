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

const BuyTicket = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;

  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [vipLevel, setVipLevel] = useState(1)
  const [isBought, setIsBought] = useState(false)

  useEffect(() => {
    if (account.length === 0) return
    checkBought()
  }, [account])

  // Listen to event
  useEffect(() => {
    contractRead.on('BuyTicket', (_buyer, _ticketCategory) => {
      if (_buyer === account) {
        const userTicketCategory = ethers.utils.parseBytes32String(_ticketCategory)
        enqueueSnackbar(`You bought a ${userTicketCategory} ticket, Waiting for Ticket Data...`, { variant: 'success' })

        // ASK the backend to submit data to IPFS
        const requestTicketInfo = async() => {
          const _response = await axios.get(`${backendUrl}ticket/${account}`)
          const _data = _response.data
          console.log("requestTicketInfo Data: ", _data);
          checkBought()
        } 
        requestTicketInfo()
      }
    })
  }, [])

  const onNameChangeHandler = (e) => {
    setName(e.target.value)
  }

  const onIdChangeHandler = (e) => {
    setId(e.target.value)
  }

  const onClickHandler = (e) => {
    // Check Wallet Connected
    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info' })
      return
    }

    const valid = inputValidate()
    if (!valid) return;

    // Check enough tickets
    const isEnoughTickets = checkEnoughTicket(vipLevel)
    if (!isEnoughTickets) return;

    const mint = async () => {
      const isSignedSucceed = await signMsg()
      console.log("isSignedSucceed:: ", isSignedSucceed)
      if (!isSignedSucceed) return;
      await mintTicket()
    }
    mint()
  }

  const checkBought = async () => {
    const _isBought = await contractRead.hasBoughtTicket(account)
    setIsBought(_isBought)
  }

  const checkEnoughTicket = (ticketType) => {
    const ticketSelected = ticketCategories.filter(ticket => ticket.categoryName == ticketType)
    if (ticketSelected.maxNoOfTickets - ticketSelected.numberOfTicketsBought <= 0) {
      enqueueSnackbar(`All tickets of ${ticketType} were sold out`)
      return false
    }
    return true
  }

  const signMsg = async () => {
    // Sign a Message
    const msg = {
      name: name,
      id: id,
      ticketType: vipLevel
    }
    const msgString = JSON.stringify(msg)
    const signedHash = await signer.signMessage(msgString)
    console.log("signedHash:", signedHash)
    const constructed = {
      address: account,
      name: name,
      id: id,
      ticketType: vipLevel,
      buySignature: signedHash
    }
    console.log("constructed:", constructed)
    const response = await axios.post(`${backendUrl}ticket`, constructed)
    console.log(response.data)

    if (response.data === true) {
      enqueueSnackbar('Signature verified successfully. Going to Mint Ticket!', { variant: 'success' })
      return true
    }
    enqueueSnackbar('Signature verified failed!', { variant: 'error' })
    return false
  }


  const mintTicket = async () => {
    const contractWrite = new ethers.Contract(contractAddress, abi, signer)
    const ticketSelected = ticketCategories.filter(ticket => ticket.categoryName == vipLevel)[0]
    console.log("ticketSelected:: ", ticketSelected)
    const _ticketType = ethers.utils.formatBytes32String(vipLevel)
    const _price = ethers.utils.parseEther(ticketSelected.ticketPrice)
    await contractWrite.buyTicket(_ticketType, { value: _price })
  }

  const inputValidate = () => {
    let allValid = true;
    if (name.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input name', { variant: 'error' })
    }

    if (id.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input ID', { variant: 'error' })
    }
    if (vipLevel.length === 0) {
      allValid = false;
      enqueueSnackbar('You must select VIP Level', { variant: 'error' })
    }
    return allValid;
  }


  return (
    <Layout title="Buy a Ticket">
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
            height: 500,
            width: 400,
          },
        }}
      >
        <Paper elevaion={3}>
          <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>Buy a Ticket!</Typography>

          {
            walletConencted ? (<Box textAlign='center' margin='1rem'>
              <div>
                <TextField
                  id="name-field"
                  value={name}
                  label="Name"
                  variant="outlined"
                  onChange={onNameChangeHandler}
                  required
                  style={{ width: '200px', margin: '5px' }} />
              </div>
              <div>
                <TextField
                  id="id-field"
                  value={id}
                  label="Passport ID"
                  variant="outlined"
                  onChange={onIdChangeHandler}
                  required
                  style={{ width: '200px', margin: '5px' }} />
              </div>
              <div>
                <FormControl style={{ width: '200px' }}>
                  <InputLabel id="vip-simple-select-label">VIP Level</InputLabel>
                  <Select
                    labelId="vip-simple-select-label"
                    id="vip-simple-select"
                    value={vipLevel}
                    label="VIP Level"
                    onChange={(e) => { setVipLevel(e.target.value) }}
                  >
                    {
                      ticketCategories.map((item, i) => (
                        <MenuItem value={item.categoryName}>{item.categoryName}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </div>
              <div>

                <Button variant="outlined" size="large" onClick={onClickHandler} style={{ marginTop: '1rem' }} disabled={isBought}>
                  {isBought ? 'ALREADY BOUGHT' : 'BUY!'}
                </Button>

              </div>
            </Box>) :
              (
                <Box textAlign='center' margin='1rem'>
                  <Typography variant='h7' alignContent='center' textAlign='center' marginTop='2rem'>Please Connect the Wallet</Typography>
                </Box>
              )
          }


        </Paper>

        <Paper elevaion={3}>
          <Box textAlign='center' margin='1rem'>
            <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>Ticket Info</Typography>
            {ticketCategories.length === 0 ? <CircularProgress /> :
              ticketCategories.map((item, i) => (
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant='subtitle2'>{item.categoryName}</Typography>
                  <Typography>Price: {item.ticketPrice} ETH</Typography>
                  <Typography>Max Num of ticket: {item.maxNoOfTickets}</Typography>
                  <Typography>Sold: {item.numberOfTicketsBought}</Typography>
                </div>
              ))
            }
          </Box>


        </Paper>
      </Box>

    </Layout>
  )
}

export default BuyTicket