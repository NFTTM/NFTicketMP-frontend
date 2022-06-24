import React, { useState, useEffect, useContext } from 'react';
import Web3Modal from 'web3modal';
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Store } from "utils/Store";
import { contractAddress, contractRead, defaultNetworkId, defaultProvider, goerliChainConfig } from 'utils/const'
import abi from 'utils/contracts/abi.json';

const pages = ['Buy Ticket', 'My Ticket', 'I am an organizer'];

const ResponsiveAppBar = () => {
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Web3 Integration
  const web3Modal = new Web3Modal({ network: 'mainnet', cacheProvider: true })

  const resetState = () => {
    dispatch({ type: 'RESET_ACCOUNT' });
    dispatch({ type: 'RESET_PROVIDER' });
    dispatch({ type: 'RESET_SIGNER' });
    dispatch({ type: 'RESET_NETWORK' });
    console.log('STATE RESETTED ...');
  };

  const updateProvider = async () => {
    const connection = await web3Modal.connect();
    const _provider = new ethers.providers.Web3Provider(connection);
    dispatch({ type: 'UPDATE_PROVIDER', payload: _provider });
    return _provider;
  };

  const updateSigner = async () => {
    const connection = await web3Modal.connect();
    const _provider = new ethers.providers.Web3Provider(connection);
    const _signer = _provider.getSigner();
    dispatch({ type: 'UPDATE_SIGNER', payload: _signer });
    return _signer;
  };

  const updateAccount = async () => {
    const connection = await web3Modal.connect();
    const _provider = new ethers.providers.Web3Provider(connection);
    const accounts = await _provider.listAccounts();
    if (accounts) dispatch({ type: 'UPDATE_ACCOUNT', payload: accounts[0] });
    return accounts[0];
  };

  const updateNetwork = async (action) => {
    if (action === 'connect') {
      const connection = await web3Modal.connect();
      const _provider = new ethers.providers.Web3Provider(connection);
      const _network = await _provider.getNetwork();
      dispatch({ type: 'UPDATE_NETWORK', payload: _network });
      dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: true });
      if (_network.chainId !== defaultNetworkId) {
        dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: false });
        // switch network
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: goerliChainConfig,
        });
      } else {
        dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: true });
      }
      return _network;
    }

    if (action === 'disconnect') {
      dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: true });
      return;
    }
  };
  
  const connectWallet = async () => {
    try {
      await updateProvider();
      await updateSigner();
      await updateAccount();
      await updateNetwork('connect');
    } catch (error) {
      console.error('connect wallet error: ', error);
      dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: false });
    }
  };

  const disconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      resetState();
      dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: false });
      updateNetwork('disconnect');
    } catch (error) {
      console.error('disconnect wallet error:', error);

    }
  };

  // On Page Load
  useEffect(() => {
    // unlock wallet
    const init = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // connectWallet
      connectWallet();

      // Listen to network changes
      if (window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          updateNetwork('connect');
        });
        window.ethereum.on('accountsChanged', (account) => {
          connectWallet();
        });
      }
    };
    init();
  }, []);



  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Arial',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NFTicket
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Arial',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NFTicket
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              walletConencted ? (
                <Button variant="contained"  onClick={disconnectWallet}>{account.substring(0,6) + '....' + account.slice(-4)}</Button>
              ) :
                (<Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
                )
            }



          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
// export default ResponsiveAppBar;
export default dynamic(() => Promise.resolve(ResponsiveAppBar), { ssr: false });

