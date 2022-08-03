import styles from "../styles/Homepage.module.css"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'


const Homepage: React.FC = () => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.AppHeader}>
                <img className={styles.tableFi} src="/TableFi_Logo.svg" alt="" />
                <div className={styles.wallet}>
                <WalletMultiButton />
                </div>
            </div>
            <div className={styles.div1}>
                <div>
                    <h1 className={styles.h1}>We give power to the individual</h1>
                    <p className={styles.para}>
                        Investing in cryptocurrencys is not easy, find out how this app will make your life easier.
                    </p>
                    <button className={styles.buttons}> Connect Wallet</button>
                    <button> Connect exchange</button>
                    <span> OR </span>

                    <div className={styles.standard}>
                        
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