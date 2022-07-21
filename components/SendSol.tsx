import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'


export const SendSol: FC = () => {
    const [balance, setBalance] = useState(0);
    const [txSig, setTxSig] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        if (!connection || !publicKey) {
            return
        }
        connection.getAccountInfo(publicKey).then(info => {
            setBalance(info.lamports)
        })
    })

    const sendSol = event => {
        event.preventDefault()
        if (!connection || !publicKey) { return }
        const transaction = new web3.Transaction()
        const recipientPubKey = new web3.PublicKey(event.target.recipient.value)

        const sendSolInstruction = web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubKey,
            lamports: web3.LAMPORTS_PER_SOL * event.target.amount.value
        })

        transaction.add(sendSolInstruction)
        sendTransaction(transaction, connection).then(sig => {
            setTxSig(sig)
        })
    }

    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

    return (
        <div>
            <div>
                <h1>{publicKey ? 'Send ANY wallet some SOL' : ""} </h1>
            </div>
            <div>
                <p>{publicKey ? `Your  Balance: ${balance / web3.LAMPORTS_PER_SOL} SOL` : ''}</p>
            </div>
            <div>
                {
                    publicKey ?
                        <form onSubmit={sendSol} className={styles.form}>
                            <label htmlFor="amount">Amount (in SOL) to send:</label>
                            <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                            <br />
                            <label htmlFor="recipient">Send SOL to:</label>
                            <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                            <button type="submit" className={styles.formButton}>Send</button>
                        </form> :
                        <span>Connect Your Wallet</span>
                }
                {
                    txSig ?
                        <div>
                            <p>View your transaction on </p>
                            <a href={link()}>Solana Explorer</a>
                        </div> :
                        null
                }
            </div>
        </div>
    )
}