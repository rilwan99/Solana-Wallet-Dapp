import styles from "../styles/Homepage.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { style } from "@mui/system";

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
            Investing in cryptocurrency is not easy, find out how this app will
            make your life easier.
          </p>

          <div>
            <div className={styles.btn1n2}>
              <button className={styles.buttons}> Connect Wallet</button>
              <button className={styles.buttons2}> Connect exchange</button>
            </div>

            <p className={styles.spanOr}> OR </p>

            <div className={styles.standard}>
              <form>
                <p className={styles.para2}>Enter Account Address:</p>
                <input
                  id="address"
                  type="text"
                  className={styles.formField}
                  placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
                  required
                />
                <button type="submit" className={styles.formButton}>
                  Submit
                </button>
              </form>
            </div>

          </div>

        </div>

        <img className={styles.pic3} src="/pic3.svg" />
        <img className={styles.pic2} src="/pic2.svg" />
        <img className={styles.pic1} src="/pic1.svg" />
      </div>

    </div>
  );
};
export default Homepage;
