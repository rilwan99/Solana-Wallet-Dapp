import { FC, useState } from "react"

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import styles from "../../styles/Home.module.css"

import { Connection } from "@solana/web3.js";
import { RawAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as web3 from "@solana/web3.js"

import { AccountLayout } from "@solana/spl-token";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getTokenPrices } from "../../lib/getPrice";

const { RestClient } = require('ftx-api');

export const BasicTable: FC = () => {

    const [addressSubmitted, setAddressSubmitted] = useState(false)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    function createData(
        assetName: string,
        symbol: string,
        balance: number,
        price: number,
        value: number
    ) {
        return { assetName, symbol, balance, price, value };
    }

    async function submitAddress(event) {

        event.preventDefault()
        setLoading(true)

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

        // Need to debug how to differentiate between tokens of the same symbol
        await getPrices();

        getTokenValue();

        setAddressSubmitted(true)
        setLoading(false)
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
        console.log(currentTokenAccounts)

        // Ierate through list of token accounts with non-zero balances
        for (let i = 0; i < currentTokenAccounts.length; i++) {

            // Find the mint address
            const mintAddress = new PublicKey(currentTokenAccounts[i].mint).toString()
            // console.log(`Mint: ` + mintAddress)

            // Find the token name, symbol using the mint address
            // const tokenMeta = await getTokenName(mintAddress)
            const tokenMeta = await getTokenName(mintAddress)
            console.log('token meta is ' + JSON.stringify(tokenMeta))
            console.log('Token name is ' + tokenMeta.name)
            console.log('Token symbol is ' + tokenMeta.abbreviation)

            // Find the token account balance 
            // getTokenAccountBalance() -> Return inconsistent values for amount & decimals
            // currentTokenAccounts.amount -> Returns only amount(n) w/o decimals
            const tokenPubKey = tokenAccounts.value[i].pubkey
            const tokenBalanceData = (await connection.getTokenAccountBalance(tokenPubKey, "finalized")).value
            const decimals = Math.pow(10, tokenBalanceData.decimals)
            const balance = Number(currentTokenAccounts[i].amount) / decimals
            console.log(`Decimals: ` + tokenBalanceData.decimals)
            console.log(`Amount: ` + currentTokenAccounts[i].amount)
            console.log('Balance: ' + balance)

            console.log("------------------------------------")
            const existingRows = rows
            existingRows.push(createData(tokenMeta.name, tokenMeta.abbreviation, balance, 0, 0))
            setRows(existingRows)
        }

    }

    // Call Solanafm's endpoint to retrieve token name, symbol, etc
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
            return result.Tokens[0]
        }
        catch (error) {
            console.log(error)
        }
    }

    async function getPrices() {
        let tokenSymbols: string[] = []
        rows.forEach(tokenInfo => tokenSymbols.push(tokenInfo.symbol))
        const tokenPrices: Number[] = await getTokenPrices(tokenSymbols)
        for (let i = 0; i < tokenPrices.length; i++) {
            rows[i].price = tokenPrices[i]
        }
    }

    function getTokenValue() {

        rows.forEach(token => {
            if (token.balance !== 0 && token.price !== 0) {
                token.value = token.balance * token.price
            }
        })
    }

    async function getExchangeBal(event) {
        event.preventDefault();
        console.log("test")
        const key = '';//'pmifmOL7FE3vorsIIEj93KdJNmyyiwPfdKQVj1T_';
        const secret = ''; //'dq_kHcKIatP-O0r1WByAvSMr3tX7yhTix4R7P91I';
        //const client = new RestClient(key, secret);
        try {
            //console.log('getBalances: ',  await client.getBalances());
            let a = await client.getBalances();
            console.log(a);
            // interface MyObj {
            //     t_bool: boolean;
            //     t_res: string;
            // }

            // let obj: MyObj = JSON.parse(a);
            // console.log(obj.t_bool);
            // console.log(obj.t_res);
            //console.log(obj); 
            //console.log('testing:',await a);
            //             console.log('testing: ', client.getBalances())
            //             arrayOfObjects.sort((a, b) => (a.propertyToSortBy > b.propertyToSortBy ? -1 : 1));
            //             test = tests.sort((a, b) => (a.nome > b.nome ? -1 : 1));
            // testsSortedByCognome = tests.sort((a, b) => (a.cognome > b.cognome ? -1 : 1));

        } catch (e) {
            console.error('Get balance failed: ', e);
        }
    }

    // function parseObject(obj) {
    //     for(var key in obj) {
    //         console.log("key: " + key + ", value: " + obj[key])
    //         if(obj[key] instanceof Object){
    //         parseObject(obj[key]);
    //         }
    //     }   
    // }   


    return (
        <div>
            <div className={styles.standard}>
                <img className={styles.loading} src="/logo.jpg" />
                <form onSubmit={submitAddress}>
                    <h2>
                        Enter Account Address:
                    </h2>
                    <input id="address" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                    <button type="submit" className={styles.formButton}>Submit</button>
                </form>
                <form onSubmit={getExchangeBal}>
                    <h2>
                        Enter API Key:
                    </h2>
                    <input id="address" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                    <button type="submit" className={styles.formButton}>Submit</button>
                </form>
            </div>

            {loading ? <img className={styles.loading} src="/loading.gif" /> : " "}

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
                                        key={row.assetName}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.assetName}</TableCell>
                                        <TableCell align="center">{row.symbol}</TableCell>
                                        <TableCell align="center">{row.balance !== 0 ? row.balance : "-"}</TableCell>
                                        <TableCell align="center">{row.price !== 0 ? row.price : "-"}</TableCell>
                                        <TableCell align="center">{row.value !== 0 ? "$ " + row.value : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> :
                    <h3 style={{ color: 'grey', textAlign: 'center' }} > </h3>
            }

        </div >
    );
}