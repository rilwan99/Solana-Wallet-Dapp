import WalletContextProvider from '../components/WalletContextProvider'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (<WalletContextProvider>
    <Component {...pageProps} />
  </WalletContextProvider>)
}

export default MyApp
