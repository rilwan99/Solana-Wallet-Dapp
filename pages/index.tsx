import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
import Head from 'next/head'
import { PingButton } from '../components/PingButton'
import { SendSol } from '../components/SendSol'
import { Portfolio } from '../components/Portfolio'

const Home: NextPage = (props) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>Solana summer Camp </title>
        <meta
          name="description"
          content="Frontend-Boilerplate Example"
        />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <Portfolio />
          {/* <SendSol /> */}
        </div>
      </WalletContextProvider >
    </div>
  );
}

export default Home