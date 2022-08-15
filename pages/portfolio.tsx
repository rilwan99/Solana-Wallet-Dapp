import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Portfolio.module.css";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import InsightsIcon from '@mui/icons-material/Insights';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";

import * as web3 from "@solana/web3.js";
import { RawAccount, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { getTokenPrices } from "../lib/getPrice";
import { getTokenName } from "../lib/getTokenName";
import { DefaultLogger } from "ftx-api";
const { RestClient } = require("ftx-api");

const drawerWidth = 240;

interface TokenInfo {
    assetName: string;
    symbol: string;
    balance: number;
    price: number;
    value: number;
}

export const Portfolio: React.FC = () => {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    // Track user Inputs
    const [address, setAddress] = React.useState("");
    const [apiKey, setApiKey] = React.useState("");
    const [apiSecret, setApiSecret] = React.useState("");

    const [totalTokens, setTotalTokens] = React.useState(0);
    const [totalAssets, setTotalAssets] = React.useState(0);

    const router = useRouter();
    // Track the route taken the user (Input Address or CEX wallet)
    const pathNameChecker = router.asPath.slice(11, 18);

    function createData(
        assetName: string,
        symbol: string,
        balance: number,
        price: number,
        value: number
    ) {
        return { assetName, symbol, balance, price, value };
    }

    React.useEffect(() => {
        // User enters via entering address in input box OR phantom wallet
        if (pathNameChecker === "address") {
            const userAddress = router.asPath.slice(19);
            setAddress(userAddress);
            submitAddress(userAddress);
        }

        // User enters via CEX wallet button
        else {
            const stop = router.asPath.indexOf("&");
            const userApiKey = router.asPath.slice(18, stop);

            const secretStart = stop + 11;
            const userApiSecret = router.asPath.slice(secretStart);

            console.log("USER API KEY IS " + userApiKey);
            console.log("USER API SECRET IS " + userApiSecret);

            setApiKey(userApiKey);
            setApiSecret(userApiSecret);
            // Insert Function to populate component using fetched data
            console.log(userApiKey, userApiSecret);
            getExchangeBal(userApiKey, userApiSecret);
        }
    }, []);

    async function submitAddress(address) {
        setLoading(true);

        const rpcEndpoint =
            "https://purple-late-paper.solana-mainnet.discover.quiknode.pro/c0f65b73def73af9ebbfdd6ebf4d8fd8c7473e6b/";
        const connection = new web3.Connection(rpcEndpoint);

        // Check for a valid SOL address provided and store in userInput
        // Fetch all the token accounts owned by the specified account
        const userInput = address;
        const tokenAccountArray = await getTokenAccount(connection, userInput);

        // Deserialize token data in AccountInfo<Buffer> and store in tokenMetaList
        const tokenMetaList: RawAccount[] =
            deserializeTokenAccounts(tokenAccountArray);

        // populate row[] with asset name, symbol and balance
        const processedRows = await processTokenAccounts(
            connection,
            tokenMetaList,
            tokenAccountArray
        );

        // populate row[] with price
        const updatedRows = await getPrices(processedRows);

        // Populate row[] with balance
        const finalRows = getTokenValue(updatedRows);
        console.log("This is finalRows", finalRows);

        // Set the total number of tokens in card component
        getTotalTokens(finalRows);

        //Set the total value of tokens in card component
        getTotalAssets(finalRows);

        setRows(finalRows);
        setLoading(false);
    }

    async function getTokenAccount(
        connection: web3.Connection,
        walletAddress: string
    ) {
        try {
            // returns RpcResponseAndContext<Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}>>
            const pubKey = new web3.PublicKey(walletAddress);
            const tokenAccountArray = await connection.getTokenAccountsByOwner(
                pubKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );
            console.log(JSON.stringify(tokenAccountArray.value));
            return tokenAccountArray;
        } catch (err) {
            console.log(err);
            window.alert(err);
        }
    }

    function deserializeTokenAccounts(tokenAccountArray): RawAccount[] {
        // type RPCResponseAndContext<T> = { context: Context, value: T}
        // T: Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}
        const tokenAccounts: {
            pubkey: web3.PublicKey;
            account: web3.AccountInfo<Buffer>;
        }[] = tokenAccountArray.value;

        const tokenMetaList: RawAccount[] = [];
        // Deserialize token account and store in tokenMetaList
        tokenAccounts.forEach((e) => {
            tokenMetaList.push(AccountLayout.decode(e.account.data));
        });
        return tokenMetaList;
    }

    async function processTokenAccounts(
        connection: web3.Connection,
        tokenMetaList: RawAccount[],
        tokenAccounts
    ) {
        // Filter for non-zero token accounts and save to validAmountAccts
        const validAmountAccts = tokenMetaList
            .map((val, index) => {
                return { value: val, index: index };
            })
            .filter((e) => e.value.amount > 0);

        const validAmountTokenAccounts = validAmountAccts.map(
            (e) => tokenAccounts.value[e.index]
        );
        const currentTokenAccounts = validAmountAccts.map((e) => e.value);
        const existingRows: TokenInfo[] = [];

        // Ierate through list of token accounts with non-zero balances
        for (let i = 0; i < currentTokenAccounts.length; i++) {
            // Find the mint address
            const mintAddress = new web3.PublicKey(
                currentTokenAccounts[i].mint
            ).toString();

            // Call Solanafm API to fetch token name and symbol
            const tokenMeta = await getTokenName(mintAddress);

            // Calculate the balance in the token account
            const tokenPubKey = validAmountTokenAccounts[i].pubkey;
            const tokenBalanceData = (
                await connection.getTokenAccountBalance(tokenPubKey)
            ).value;
            console.log("decimals is from " + tokenBalanceData.decimals);
            const decimals = Math.pow(10, tokenBalanceData.decimals);

            const balance = Number(currentTokenAccounts[i].amount) / decimals;
            console.log("Amount is from " + currentTokenAccounts[i].amount);

            console.log("---------Next Token---------");

            if (tokenMeta) {
                existingRows.push(
                    createData(tokenMeta.name, tokenMeta.abbreviation, balance, 0, 0)
                );
            }
        }
        return existingRows;
    }

    // Fetch the price of each token in row[]
    async function getPrices(rows: TokenInfo[]) {
        let tokenSymbols: string[] = [];
        rows.forEach((tokenInfo) => tokenSymbols.push(tokenInfo.symbol));

        // Calling Coingecko API
        const tokenPrices: number[] = await getTokenPrices(tokenSymbols);
        for (let i = 0; i < tokenPrices.length; i++) {
            rows[i].price = tokenPrices[i];
        }
        return rows;
    }

    // Calculate the value for each token using price and value
    function getTokenValue(rows: TokenInfo[]) {
        rows.forEach((token) => {
            if (token.balance !== 0 && token.price !== 0) {
                token.value = token.balance * token.price;
            }
        });
        return rows;
    }

    function getTotalTokens(rows: TokenInfo[]) {
        let num = 0;
        rows.forEach((tokenInfo) => {
            num += tokenInfo.balance;
        });
        setTotalTokens(num);
    }

    function getCexTotalTokens(rows: TokenInfo[]) {
        let num = 0;
        rows.forEach((tokenInfo) => {
            console.log(tokenInfo);
            //num += tokenInfo.total;
        });
        //setTotalTokens(num)
    }

    function getTotalAssets(rows: TokenInfo[]) {
        let num = 0;
        rows.forEach((tokenInfo) => {
            num += tokenInfo.value;
        });
        setTotalAssets(num);
    }

    async function getExchangeBal(apiKey, apiSecret) {
        //event.preventDefault();
        const client = new RestClient(apiKey, apiSecret);
        const existingRows: TokenInfo[] = [];
        try {
            let a = await client.getBalances();
            const result = a.result;
            const nonZeroBalance = result.filter((account) => account.total > 0);
            console.log(nonZeroBalance);
            for (let i = 0; i < nonZeroBalance.length; i++) {
                existingRows.push(
                    createData(
                        nonZeroBalance[i].coin,
                        nonZeroBalance[i].coin,
                        nonZeroBalance[i].total,
                        nonZeroBalance[i].usdValue / nonZeroBalance[i].total,
                        nonZeroBalance[i].usdValue
                    )
                );
                //console.log(existingRows);
            }

            // Set the total number of tokens in card component
            getTotalTokens(existingRows);

            //Set the total value of tokens in card component
            getTotalAssets(existingRows);

            setRows(existingRows);
            setLoading(false);
            // console.log(a.result[5].total);
        } catch (e) {
            console.error("Get balance failed: ", e);
        }
    }

    async function getOrderHistory(apiKey, apiSecret) {
        const client = new RestClient(apiKey, apiSecret);
        try {
            let amt = await client.getFills();
            const result = amt.result;
            console.log(result);
        } catch (e) {
            console.error("Get history failed: ", e);
        }
    }

    const handleClickInvestment = (e) => {
        e.preventDefault()
        if (address) {
            const url = "/invest?address=" + address;
            router.push(url)
        }
        if (apiKey && apiSecret) {
            const url = "/invest?apiKey=" + apiKey + "&apiSecret=" + apiSecret;
            router.push(url)
        }
    }

    const handleClickDashboard = (e) => {
        e.preventDefault()
        if (address) {
            const url = "/dashboard?address=" + address;
            router.push(url)
        }
        if (apiKey && apiSecret) {
            const url = "/dashboard?apiKey=" + apiKey + "&apiSecret=" + apiSecret;
            router.push(url)
        }
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
            }}
        >
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <div className={styles.div1}>
                    <Image src="/TableFi_Logo.svg" height={50} width={200} />
                    <br />
                    <Divider />

                    <List>

                        <ListItem key='DASHBOARD' disablePadding>
                            <ListItemButton onClick={handleClickDashboard}>
                                <ListItemIcon className={styles.menuItem}>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText className={styles.menuItem} primary='DASHBOARD' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='PORTFOLIO' disablePadding>
                            <ListItemButton>
                                <ListItemIcon className={styles.menuItemPrimary}>
                                    <LocalMallIcon />
                                </ListItemIcon>
                                <ListItemText className={styles.menuItemPrimary} primary='PORTFOLIO' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='INVESTMENT' disablePadding>
                            <ListItemButton onClick={handleClickInvestment}>
                                <ListItemIcon className={styles.menuItem}>
                                    <InsightsIcon />
                                </ListItemIcon>
                                <ListItemText className={styles.menuItem} primary='INVESTMENT' />
                            </ListItemButton>
                        </ListItem>

                    </List>
                </div>
            </Drawer>

            <Box
                // component="main"
                sx={{
                    height: "100%",
                    flexGrow: 1,
                    bgcolor: "#242F37",
                    p: 3,
                }}
            >
                {address ? (
                    <h1 className={styles.text}>Portfolio (Phantom Wallet)</h1>
                ) : (
                    <div></div>
                )}
                {apiSecret && apiKey ? (
                    <h1 className={styles.text}>
                        Portfolio (FTX Wallet)
                    </h1>
                ) : (
                    <div></div>
                )}
                <h3 className={styles.text}>Porfolio overview</h3>
                <div className={styles.div0}>
                    <div className={styles.diva1}>
                        <Card
                            sx={{
                                minWidth: 475,
                                width: 488,
                                height: 200,
                                bgcolor: "#5EC2B7",
                            }}
                        >
                            <p className={styles.totalAsset}> Total Portfolio Assets <Tooltip title="Total Value of assets across all accounts"><InfoIcon /></Tooltip> </p>
                            <CardContent>
                                <div className={styles.totalassetContainer}>
                                    <p className={styles.para1}>
                                        {" "}
                                        <span className={styles.currencyIcon}> $ </span>{" "}
                                        <span className={styles.totalAmount}>
                                            {" "}
                                            {totalAssets.toFixed(5)}{" "}
                                        </span>{" "}
                                        <span className={styles.dollarIcon}> USD </span>{" "}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className={styles.div3}>
                            <div className={styles.tokenCont}>
                                <Card
                                    sx={{
                                        minWidth: 275,
                                        height: 150,
                                        bgcolor: "#5D55A6",
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 20,
                                                color: "#ffff",
                                            }}
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Token Quantity <Tooltip title="Total number of SPL tokens across all accounts"><InfoIcon /></Tooltip>
                                        </Typography>
                                        <div className={styles.tokensAmount}>
                                            {totalTokens.toFixed(4)}{" "}
                                            <span className={styles.tokensFont}>Tokens</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className={styles.portfolioCont}>
                                <Card
                                    sx={{
                                        width: 50,
                                        height: 150,
                                        bgcolor: "#E46E7E",
                                        minWidth: 205,
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 20,
                                                color: "#ffff",
                                            }}
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Portfolios <Tooltip title="Numer of accounts connected"><InfoIcon /></Tooltip>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 50,
                                                color: "#ffff",
                                            }}
                                        >
                                            1
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cardConainer3}>
                        <Card
                            sx={{
                                width: 308,
                                height: 330,
                                bgcolor: "#364652",
                                minWidth: 531,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 25,
                                        color: "#ffff",
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Assets Distributions <Tooltip title="Distribution of SPL tokens across all accounts"><InfoIcon /></Tooltip>
                                </Typography>

                                <div className={styles.piechartContainer}>
                                    <img
                                        className={styles.piechartImg}
                                        src="/pieChart.png"
                                        alt="pieChart"
                                    />
                                    <div className={styles.disDiscription}>
                                        <div className={styles.solContainer}>
                                            <img className={styles.solImg} src="/sol.png" alt="sol" />
                                            <p className={styles.solFont}> 50% - SOL</p>
                                        </div>
                                        <div className={styles.solContainer}>
                                            <img className={styles.solImg} src="/btc.png" alt="sol" />
                                            <p className={styles.solFont}> 30% - BTC</p>
                                        </div>
                                        <div className={styles.solContainer}>
                                            <img className={styles.solImg} src="/eth.png" alt="sol" />
                                            <p className={styles.solFont}> 15% - ETH</p>
                                        </div>
                                        <div className={styles.solContainer}>
                                            <img
                                                className={styles.solImg}
                                                src="/other.png"
                                                alt="sol"
                                            />
                                            <p className={styles.solFont}> 5% - others</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Show loading gif when user wallet data is still being fetched */}
                {loading ? <img className={styles.loading} src="/loading.gif" /> : ""}

                {/* If loading is completed but user wallet has no assets */}
                {!loading && rows.length === 0 ? (
                    <h1 className={styles.nullAsset}>You have 0 assets on Mainnet</h1>
                ) : (
                    ""
                )}

                {/* If loading is completed and user wallet has existing assets */}
                {!loading && rows.length > 0 ? (
                    <div className={styles.TableContainer}>
                        <div className={styles.assetDTitle}>Asset Details</div>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{
                                    height: "100%",
                                    bgcolor: "#364652",
                                    minWidth: 725,
                                }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow className={styles.tableRow}>
                                        <TableCell className={styles.tableRow}>
                                            Asset Name
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            Symbol
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            Balance
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            Price (USD)
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            Value
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.assetName}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell
                                                className={styles.tableRow}
                                                component="th"
                                                scope="row"
                                            >
                                                {row.assetName}
                                            </TableCell>
                                            <TableCell className={styles.symbol} align="right">
                                                {row.symbol}
                                            </TableCell>
                                            <TableCell className={styles.tableRow} align="right">
                                                {row.balance !== 0 ? row.balance.toFixed(10) : "-"}
                                            </TableCell>
                                            <TableCell className={styles.tableRow} align="right">
                                                {row.price !== 0 ? row.price.toFixed(5) : "-"}
                                            </TableCell>
                                            <TableCell className={styles.tableRow} align="right">
                                                {row.value !== 0 ? "$ " + row.value.toFixed(10) : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : (
                    ""
                )}
            </Box>
        </Box>
    );
};

export default Portfolio;
