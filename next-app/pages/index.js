import React, { useContext } from 'react'
import { Typography } from '@mui/material';

import Layout from 'components/Layout'
import { Store } from "utils/Store";

const Home = () => {
  const { state, dispatch } = useContext(Store);

  return (
    <Layout title="mytitle">
      <Typography>Hello world</Typography>

    </Layout>
  )
}

export default Home