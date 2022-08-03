import styles from "../styles/Homepage.module.css"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'


const Homepage: React.FC = () => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.AppHeader}>
                <Image src="/TableFi_Logo.svg" height={30} width={200} />
                <WalletMultiButton />
            </div>
            <div className={styles.div1}>
                <div>
                    <h1>We give power to the individual</h1>
                    <h3>
                        Investing in cryptocurrencys is not easy, find out how this app will make your life easier.
                    </h3>
                    <button> Connect Wallet</button>
                    <button> Connect exchange</button>
                    <span> OR </span>

                    <div className={styles.standard}>
                        <img className={styles.loading} src="/logo.jpg" />
                        <form>
                            <h3>
                                Enter Account Address:
                            </h3>
                            <input id="address" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                            <button type="submit" className={styles.formButton}>Submit</button>
                        </form>
                    </div>

                </div>



                <img className={styles.pic1} src="/pic1.svg" />
                <img className={styles.pic2} src="/pic2.svg" />
                <img className={styles.pic3} src="/pic3.svg" />
            </div>
        </div>
    );
}
export default Homepage