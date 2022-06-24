import React, { useContext, useState, useEffect } from 'react'
import { Typography, Box, Paper, Button, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/Layout'
import { Store } from "utils/Store";

const BuyTicket = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;

  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [vipLevel, setVipLevel] = useState(1)

  // @DEBUG
  useEffect(() => {
    console.log(">>> debugging....")
    console.log("walletConencted:", walletConencted)
    console.log("correctNetworkConnected:", correctNetworkConnected)
    console.log("account:", account)
    console.log("provider:", provider)
    console.log("signer:", signer)
  }, [walletConencted, correctNetworkConnected, account, provider, signer])


  const onNameChangeHandler = (e) => {
    setName(e.target.value)
  }

  const onIdChangeHandler = (e) => {
    setId(e.target.value)
  }

  const onClickHandler = (e) => {
    const valid = inputValidate()
    if (!valid) return;

    // Check Wallet Connected
    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info' })
      return
    }

    const signMsg = async () => {
      // Sign a Message
      const msg = {
        name, id, event: 'superbowl'
      }
      const signedHash = await signer.signMessage(JSON.stringify(msg))
      console.log("Signed Hash is:::", signedHash)
    }

    signMsg()


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

    if (![1, 2, 3].includes(vipLevel)) {
      allValid = false;
      enqueueSnackbar('Vip Level Wrong!', { variant: 'error' })
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
            height: 400,
            width: 400,
          },
        }}
      >
        <Paper elevaion={3}>
          <Typography variant='h6' alignContent='center' textAlign='center' marginTop='2rem'>Buy a Ticket!</Typography>

          <Box textAlign='center' margin='1rem'>
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
                  <MenuItem value={1}>VIP 1</MenuItem>
                  <MenuItem value={2}>VIP 2</MenuItem>
                  <MenuItem value={3}>VIP 3</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>

              <Button variant="outlined" size="large" onClick={onClickHandler} style={{ marginTop: '1rem' }}>
                BUY!
              </Button>
            </div>
          </Box>

        </Paper>
      </Box>

    </Layout>
  )
}

export default BuyTicket