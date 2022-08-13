import styles from "../styles/Homepage.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { style } from "@mui/system";
import { useState, useEffect } from "react";
import React from "react";
import Popup from "reactjs-popup";
import { PopupProps } from "reactjs-popup/dist/types";
import { PopupActions } from "reactjs-popup/dist/types";
import Link from "next/link";
import Router from "next/router";

import LoginIcon from "@mui/icons-material/Login";

import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

class inputForm {
  id = "";
  apikey: string;
  apisecret: string;
}

const Homepage: React.FC = () => {
  const [data, setData] = useState({ address: "" });
  const [cexData1, setCexData1] = useState({ apiKey: "" });
  const [cexData2, setCexData2] = useState({ apiSecret: "" });
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      const userAddress = publicKey.toString();
      const url = "/dashboard?address=" + userAddress;
      Router.push(url);
    }
  }, [publicKey]);

  async function submitAddress(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const userInput = event.target.value;
      console.log(userInput);
      const pubKey = new web3.PublicKey(userInput);
      console.log(pubKey);
      setData({ address: event.target.value });
      setLoading(false);
    } catch (err) {
      // console.log(err)
      window.alert(err);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.AppHeader}>
        <img className={styles.tableFi} src="/TableFi_Logo.svg" alt="" />
        <WalletMultiButton />
      </div>

      <div className={styles.div1}>
        <div>
          <h1 className={styles.h1}>We give power to the individual</h1>
          <p className={styles.para}>
            Investing in cryptocurrency is not easy, find out how this app will
            make your life easier.
          </p>

          <div className={styles.walletContainer}>
            <div className={styles.btn1n2}>
              <div className={styles.buttons3}>
                <WalletMultiButton />
              </div>
              <div>
                <Popup
                  trigger={
                    <button className={styles.buttons2}>
                      {" "}
                      Select Exchange{" "}
                    </button>
                  }
                  position="right center"
                >
                  <div className={styles.formA}>
                    <form>
                      <label htmlFor="ApiKey">Enter read-only API Key:</label>
                      <input
                        type="text"
                        name="ApiKey"
                        id="ApiKey"
                        onChange={(event) =>
                          setCexData1({
                            apiKey: event.target.value,
                          })
                        }
                      />

                      <label htmlFor="ApiSecret">
                        Enter read-only API Secret:
                      </label>
                      <input
                        type="text"
                        name="ApiSecret"
                        id="ApiSecret"
                        onChange={(event) =>
                          setCexData2({
                            apiSecret: event.target.value,
                          })
                        }
                      />
                      <p></p>

                      {/* <button type="submit">Submit</button> */}
                      <Link
                        href={{
                          pathname: "/dashboard",
                          query: {
                            apiKey: cexData1.apiKey,
                            apiSecret: cexData2.apiSecret,
                          }, // the data
                        }}
                        passHref
                      >
                        <a className={styles.buttonSubmit}> Submit </a>
                      </Link>
                    </form>
                  </div>
                </Popup>
              </div>
            </div>

            <p className={styles.spanOr}> OR </p>

            <div className={styles.standard}>
              <form>
                <p className={styles.para2}>Enter Account Address:</p>
                <br />
                <input
                  type="text"
                  className={styles.formField}
                  placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
                  value={data.address}
                  onChange={(event) =>
                    setData({
                      address: event.target.value,
                    })
                  }
                />

                <div className={styles.submit}>
                  <Link
                    href={{
                      pathname: "/dashboard",
                      query: data, // the data
                    }}
                    passHref
                  >
                    <a className={styles.submitText}>
                      {" "}
                      Submit
                      <LoginIcon />{" "}
                    </a>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.imgLanding}>
          <img className={styles.pic3} src="/pic3.svg" />
          <img className={styles.pic2} src="/pic2.svg" />
          <img className={styles.pic1} src="/pic1.svg" />
        </div>
      </div>
    </div>
  );
};
export default Homepage;
