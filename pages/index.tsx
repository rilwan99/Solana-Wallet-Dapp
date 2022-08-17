import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import Head from 'next/head'
import Dashboard from './dashboard'
import Homepage from './homePage'
import Invest from "./invest"

const Home: NextPage = (props) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>TableFi: One stop platform</title>
        <meta
          name="description"
          content="One stop platform for you to track your Solana assets"
        />
      </Head>

      {/* <WalletContextProvider> */}
      <Homepage />
      {/* </WalletContextProvider > */}

    </div>
  );
}

export default Home