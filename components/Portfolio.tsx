import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { Connection } from "@solana/web3.js";
import { RawAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as web3 from '@solana/web3.js'

import { AccountLayout } from "@solana/spl-token";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

export const Portfolio: FC = () => {

    async function getTokenAccount() {
        const connection = new Connection(clusterApiUrl('mainnet-beta'));

        // Fetch all the token accounts owned by the specified account 
        // returns RpcResponseAndContext<Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}>>
        const tokenAccountArray = await connection.getTokenAccountsByOwner(
            new PublicKey('Ck1b1oTDXvDDWmci5j2XCCtRQ9QmAByeGFqJLhqzoXqN'),
            {
                programId: TOKEN_PROGRAM_ID,
            }
        );

        // type RPCResponseAndContext<T> = { context: Context, value: T}
        // T: Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}
        const tokenAccounts: { pubkey: PublicKey; account: web3.AccountInfo<Buffer>; }[] = tokenAccountArray.value

        // export interface RawAccount {
        //     mint: PublicKey;
        //     owner: PublicKey;
        //     amount: bigint;
        //     ...
        // }
        const accountInfo: RawAccount[] = []

        // Deserialize token account and store in accountInfo
        tokenAccounts.forEach((e) => {
            accountInfo.push(AccountLayout.decode(e.account.data))
        })

        // Filter for token accounts with non-zero balances
        const currentTokenAccounts = accountInfo.filter(e => e.amount > 0)

        // Print the mintAuthority, name, symbol and balance of each token
        for (let i = 0; i < currentTokenAccounts.length; i++) {

            const mintAddress = new PublicKey(currentTokenAccounts[i].mint).toString()
            console.log(`Mint: ` + mintAddress)

            const tokenMeta: Object = await getTokenName(mintAddress)
            // const tokenInfo = JSON.stringify(tokenMeta)
            // console.log(tokenInfo)
            console.log('Token name is ' + tokenMeta['name'])
            console.log('Token symbol is ' + tokenMeta['abbreviation'])

            const tokenBalanceData = (await connection.getTokenAccountBalance(tokenAccounts[i].pubkey)).value
            console.log(`Balance: ` + tokenBalanceData.uiAmountString)
            // console.log(tokenBalanceData)

            console.log("------------------------------------")
        }

    }

    // Send GET request to solanafm endpoint
    async function getTokenName(mintName: String): Promise<any> {
        const request = 'https://hyper.solana.fm/v2/search/tokens/' + mintName
        try {
            const response = await fetch(request)
            const result = await response.json()
            // Return tokens name, abbreviation, network, hash, etc
            return result.Tokens[0]
        }
        catch (error) {
            console.log(error)
        }
    }

    getTokenAccount()
    return (
        <div>
            <div className={styles.standard}>
                <h2>
                    Enter Account Address:
                </h2>
                <input id="address" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Submit</button>
            </div>
        </div >
    )
}