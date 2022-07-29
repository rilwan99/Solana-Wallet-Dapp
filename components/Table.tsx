import { FC, useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import styles from '../styles/Home.module.css'

import { Connection } from "@solana/web3.js";
import { RawAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as web3 from '@solana/web3.js'

import { AccountLayout } from "@solana/spl-token";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

import * as axios from 'axios'

const proxy = require("http-proxy-middleware");

export const BasicTable: FC = () => {

    const [addressSubmitted, setAddressSubmitted] = useState(false)

    function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    // type tokenDisplay {
    //     assetName: string,
    //     symbol: string,
    //     balance: string,
    //     price: string,
    //     value: string
    // }

    async function submitAddress(event) {

        event.preventDefault()

        const rpcEndpoint = "https://purple-late-paper.solana-mainnet.discover.quiknode.pro/c0f65b73def73af9ebbfdd6ebf4d8fd8c7473e6b/"
        const connection = new Connection(rpcEndpoint);
        // const connection = new Connection(clusterApiUrl('mainnet-beta'));

        // Check for a valid SOL address provided and store in userInput
        // Fetch all the token accounts owned by the specified account 
        const userInput = event.target.address.value
        const tokenAccountArray = await getTokenAccount(connection, userInput);

        // Deserialize token data in AccountInfo<Buffer> and store in tokenMetaList 
        const tokenMetaList: RawAccount[] = deserializeTokenAccounts(tokenAccountArray);

        await processTokenAccounts(connection, tokenMetaList, tokenAccountArray);

        setAddressSubmitted(true)
    }

    async function getTokenAccount(connection: Connection, walletAddress: string) {

        try {
            // returns RpcResponseAndContext<Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}>>
            const pubKey = new PublicKey(walletAddress)
            const tokenAccountArray = await connection.getTokenAccountsByOwner(
                pubKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );
            return tokenAccountArray
        } catch (err) {
            console.log(err)
            window.alert(err)
        }
    }

    function deserializeTokenAccounts(tokenAccountArray): RawAccount[] {

        // type RPCResponseAndContext<T> = { context: Context, value: T}
        // T: Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}
        const tokenAccounts: { pubkey: PublicKey; account: web3.AccountInfo<Buffer>; }[] = tokenAccountArray.value

        // export interface RawAccount {
        //     mint: PublicKey;
        //     owner: PublicKey;
        //     amount: bigint;
        //     ...
        // }
        const tokenMetaList: RawAccount[] = []

        // Deserialize token account and store in tokenMetaList
        tokenAccounts.forEach((e) => {
            tokenMetaList.push(AccountLayout.decode(e.account.data))
        })

        return tokenMetaList;
    }

    async function processTokenAccounts(connection: Connection, tokenMetaList: RawAccount[], tokenAccounts) {

        // Filter for token accounts with non-zero balances
        const currentTokenAccounts = tokenMetaList.filter(e => e.amount > 0)

        // Print the mintAuthority, name, symbol and balance of each token
        for (let i = 0; i < currentTokenAccounts.length; i++) {

            const mintAddress = new PublicKey(currentTokenAccounts[i].mint).toString()
            console.log(`Mint: ` + mintAddress)

            const tokenMeta = await getTokenName(mintAddress)
            console.log("Token Meta is " + tokenMeta)
            const tokenInfo = JSON.stringify(tokenMeta)
            console.log("Token info is " + tokenInfo)
            // console.log('Token name is ' + tokenMeta.name)
            // console.log('Token symbol is ' + tokenMeta.abbreviation)

            const tokenPubKey = tokenAccounts.value[i].pubkey
            const tokenBalanceData = (await connection.getTokenAccountBalance(tokenPubKey)).value
            console.log(`Balance: ` + tokenBalanceData.uiAmountString)

            console.log("------------------------------------")
        }

    }

    async function getTokenName(mintName: String): Promise<any> {
        const url = 'https://hyper.solana.fm/v2/search/tokens/' + mintName
        try {
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: {}
            })
            const result = await response.json()
            // Return tokens name, abbreviation, network, hash, etc
            console.log("api call is " + result.Tokens)
            return result.Tokens[0]
        }
        catch (error) {
            console.log(error)
        }
    }

    // async function getTokenName(mintName: String): Promise<any> {
    //     const url = 'https://hyper.solana.fm/v2/search/tokens/' + mintName
    //     const myHeader = new Headers();
    //     const myRequest = new Request(url, {
    //         method: 'GET',
    //         headers: myHeader,
    //         mode: 'cors',
    //         cache: 'default',
    //     });
    //     fetch(myRequest)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 console.log(response)
    //                 throw new Error('Network response was not OK');
    //             }
    //             return response.json();
    //         })
    //         .catch((error) => {
    //             console.error('There has been a problem with your fetch operation:', error);
    //         });
    // }

    return (
        <div>
            <div className={styles.standard}>
                <form onSubmit={submitAddress}>
                    <h2>
                        Enter Account Address:
                    </h2>
                    <input id="address" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                    <button type="submit" className={styles.formButton}>Submit</button>
                </form>
            </div>

            {
                addressSubmitted ?
                    <TableContainer component={Paper} sx={{ maxWidth: 1000, backgroundColor: "rgb(182, 195, 224)", marginTop: 2, marginBottom: 5 }}>
                        <Table sx={{ minWidth: 650, maxWidth: 1000 }} aria-label="simple table">
                            <TableHead >
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>Asset Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Symbol</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Balance</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Price (USD)</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.calories}</TableCell>
                                        <TableCell align="center">{row.fat}</TableCell>
                                        <TableCell align="center">{row.carbs}</TableCell>
                                        <TableCell align="center">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> :
                    <h3 style={{ color: 'grey', textAlign: 'center' }} >Submit your address</h3>
            }

        </div >
    );
}