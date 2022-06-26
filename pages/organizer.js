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
  const { adminAddress, walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;

  const [loaded, setLoaded] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  // SET UP NEW TICKET
  const [newName, setNewName] = useState('')
  const [newTicketPrice, setNetTicketPrice] = useState('')
  const [newMaxNumOfTicket, setNewMaxNumOfTicket] = useState(0)

  const onNameChangeHandler = (e) => {
    setNewName(e.target.value)
  }

  const onTicketPriceChangeHandler = (e) => {
    setNetTicketPrice(e.target.value)
  }

  const onMaxNumTicketChangeHandler = (e) => {
    setNewMaxNumOfTicket(e.target.value)
  }

  const onCreateTicketHandler = (e) => {
    const create = async () => {
      try {
        const _name = ethers.utils.formatBytes32String(newName)
        const _price = ethers.utils.parseEther(newTicketPrice)
        const _maxNumber = parseInt(newMaxNumOfTicket)
        const contractWrite = new ethers.Contract(contractAddress, abi, signer)
        await contractWrite.setUpTicket(_name, _price, _maxNumber, 0)
        enqueueSnackbar("Ticket Creation Submitted", { variant: "info" })
      }
      catch (error) {
        enqueueSnackbar("Create Ticket Error:", error)
      }
    }
    create()
  }


  useEffect(() => {
    if (adminAddress.length === 0 || account.length == 0) {
      setLoaded(false)
      setAdminConnected(false)
    }
    if (adminAddress === account) {
      closeSnackbar()
      enqueueSnackbar('Welcome to the admin dashboard', { variant: 'success' })
      setAdminConnected(true)
    } else {
      closeSnackbar()
      enqueueSnackbar('Sorry, you are not admin of the contract', { variant: 'error' })
      setAdminConnected(false)
    }
  }, [account, adminAddress])

  return (
    <Layout title="Organizer">
      {
        walletConencted && adminConnected ? <>
          <Box textAlign='center' margin='1rem'>
            <Typography>Welcome to use Admin panel</Typography>
          </Box>
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
                height: 250,
                width: 250,
              },
            }}
          >
            {
              ticketCategories.map((item, i) => (

                <Paper elevaion={3}>
                  <Box textAlign='center' margin='0.5rem'>
                    <Typography variant='h6' alignContent='center' textAlign='center' margin='2rem'>Ticket {item.categoryName}</Typography>
                    {/* <Typography variant='subtitle2'>{item.categoryName}</Typography> */}
                    <Typography>Price: {item.ticketPrice} ETH</Typography>
                    <Typography>Max Num: {item.maxNoOfTickets}</Typography>
                    <Typography>Sold: {item.numberOfTicketsBought}</Typography>
                  </Box>
                </Paper>

              ))
            }


            <Paper elevaion={3}>
              <Box textAlign='center' margin='1rem'>
                <Typography variant='h6' alignContent='center' textAlign='center' margin='0.5rem'>New Ticket</Typography>
                <div style={{ margin: '0.2rem' }}>
                  <TextField
                    id="id-field"
                    size="small"
                    value={newName}
                    label="Ticket Name"
                    variant="outlined"
                    onChange={onNameChangeHandler}
                    required
                  />
                </div>
                <div style={{ margin: '0.2rem' }}>
                  <TextField
                    id="price-field"
                    size="small"
                    value={newTicketPrice}
                    label="Price"
                    variant="outlined"
                    onChange={onTicketPriceChangeHandler}
                    required
                  />
                </div>
                <div style={{ margin: '0.2rem' }}>

                  <TextField
                    id="max-num-field"
                    size="small"
                    value={newMaxNumOfTicket}
                    label="Max Supply"
                    variant="outlined"
                    onChange={onMaxNumTicketChangeHandler}
                    required
                  />
                </div>
                <div style={{ margin: '0.2rem' }}>
                  <Button size="small" onClick={onCreateTicketHandler}>CREATE NEW TICKET</Button>
                </div>
              </Box>
            </Paper>

          </Box>





        </> : <>
          <Box textAlign='center' margin='1rem'>
            <Typography>You must login with Admin Account</Typography>
          </Box>
        </>
      }


    </Layout>
  )
}

export default Organizer