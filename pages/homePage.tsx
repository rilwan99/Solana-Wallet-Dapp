import styles from "../styles/Homepage.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { style } from "@mui/system";
import {useState} from 'react';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function someFunction(event,abc) {
   console.log(event);
   alert(event.className);
}

const handleClick = event => {
    event.preventDefault();

    // 👇️ value of input field
    console.log('handleClick 👉️', message);
  };

function validateFormWithJS() {
    const name = document.querySelector('#ApiKey').value
    const rollNumber = document.querySelector('#ApiSecret').value

    if (!name) {
      alert('Please enter your API Key.')
      return false
    }

    if (rollNumber.length < 3) {
      alert('Roll Number should be at least 3 digits long.')
      return false
    }
  }


const Homepage: React.FC = () => {
//     event.preventDefault()
//     const data = {
//         first: event.target.first.value,
//         last: event.target.last.value,
//       }
//       const JSONdata = JSON.stringify(data);
//       const endpoint = '/api/form';
//       const options = {
//         // The method is POST because we are sending data.
//         method: 'POST',
//         // Tell the server we're sending JSON.
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // Body of the request is the JSON data we created above.
//         body: JSONdata,
//       }

//       // Send the form data to our forms API on Vercel and get a response.
//     const response = await fetch(endpoint, options)

//     // Get the response data from server as JSON.
//     // If server returns the name submitted, that means the form works.
//     const result = await response.json()
//     alert(`Is this your full name: ${result.data}`)
//   }

    
// 👇️ value of input field
// console.log('handleClick 👉️', message);
// };

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
          <h1 className={styles.h1}>We give poweR to the individual</h1>
          <p className={styles.para}>
            Investing in cryptocurrencys is not easy, find out how this app will
            make your life easier.
          </p>
          <div className={styles.btngrp}>
            <div className={styles.btn1n2}>
              <button className={styles.buttons}> Connect Wallet</button>
              <Popup trigger={<button className={styles.buttons2}> Connect Exchange </button>} 
                position="right center">
                <div>
                <form onSubmit={validateFormWithJS}>
                    <label htmlFor="ApiKey">API Key:</label>
                    <input type="text" name="ApiKey" id="ApiKey" />

                    <label htmlFor="ApiSecret"> API Secret:</label>
                    <input type="text" name="ApiSecret" id="ApiSecret" />

                    <button type="submit">Submit</button>
                </form>
                </div>
              </Popup>
            </div>
            <span className={styles.spanOr}> OR </span>

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
