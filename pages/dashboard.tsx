import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";

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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { CenterFocusStrong, PieChart } from "@mui/icons-material";
import { style } from "@mui/system";
import { Card } from "@mui/material";


import * as web3 from "@solana/web3.js"
import { RawAccount, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { getTokenPrices } from "../lib/getPrice";
import { getTokenName } from "../lib/getTokenName";

const drawerWidth = 240;

export const Dashboard: React.FC = () => {

  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const router = useRouter();
  const query = router.query;

  const address = query.address;
  const apiKey = query.apiKey;
  const apiSecret = query.apiSecret

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

    if (address) {
      submitAddress(address)
    }

    if (apiKey && apiSecret) {


    }
  }, [])

  //

  async function submitAddress(address) {

    setLoading(true)

    const rpcEndpoint = "https://purple-late-paper.solana-mainnet.discover.quiknode.pro/c0f65b73def73af9ebbfdd6ebf4d8fd8c7473e6b/"
    const connection = new web3.Connection(rpcEndpoint);

    // Check for a valid SOL address provided and store in userInput
    // Fetch all the token accounts owned by the specified account 
    const userInput = address
    const tokenAccountArray = await getTokenAccount(connection, userInput);

    // Deserialize token data in AccountInfo<Buffer> and store in tokenMetaList 
    const tokenMetaList: RawAccount[] = deserializeTokenAccounts(tokenAccountArray);

    await processTokenAccounts(connection, tokenMetaList, tokenAccountArray);

    // Need to debug how to differentiate between tokens of the same symbol
    await getPrices();

    getTokenValue();

    setLoading(false)
  }

  async function getTokenAccount(connection: web3.Connection, walletAddress: string) {

    try {
      // returns RpcResponseAndContext<Array<{pubkey: PublicKey; account: AccountInfo<Buffer>;}>>
      const pubKey = new web3.PublicKey(walletAddress)
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
    const tokenAccounts: { pubkey: web3.PublicKey; account: web3.AccountInfo<Buffer>; }[] = tokenAccountArray.value

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

  async function processTokenAccounts(connection: web3.Connection, tokenMetaList: RawAccount[], tokenAccounts) {

    // Filter for token accounts with non-zero balances
    const currentTokenAccounts = tokenMetaList.filter(e => e.amount > 0)
    console.log(currentTokenAccounts)

    const existingRows = []

    // Ierate through list of token accounts with non-zero balances
    for (let i = 0; i < currentTokenAccounts.length; i++) {

      // Find the mint address
      const mintAddress = new web3.PublicKey(currentTokenAccounts[i].mint).toString()
      // console.log(`Mint: ` + mintAddress)

      // Call Solanafm API
      const tokenMeta = await getTokenName(mintAddress)

      // Find the token account balance 
      // getTokenAccountBalance() -> Return inconsistent values for amount & decimals
      // currentTokenAccounts.amount -> Returns only amount(n) w/o decimals
      const tokenPubKey = tokenAccounts.value[i].pubkey
      const tokenBalanceData = (await connection.getTokenAccountBalance(tokenPubKey, "finalized")).value
      const decimals = Math.pow(10, tokenBalanceData.decimals)
      const balance = Number(currentTokenAccounts[i].amount) / decimals


      console.log("------------------------------------")
      existingRows.push(createData(tokenMeta.name, tokenMeta.abbreviation, balance, 0, 0))
    }

    console.log(existingRows)
    setRows(existingRows)
  }


  async function getPrices() {
    let tokenSymbols: string[] = []
    rows.forEach(tokenInfo => tokenSymbols.push(tokenInfo.symbol))
    console.log("calling get Price function")
    // Calling Coingecko API
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

  return (
    <Box sx={{ display: "flex" }}>

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
            {["DASHBOARD", "PORTFOLIO", "SETTING"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon className={styles.menuItem}>
                    {index % 2 === 0 ? <DashboardIcon /> : <LocalMallIcon />}
                  </ListItemIcon>
                  <ListItemText className={styles.menuItem} primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#242F37",
          p: 3,
          maxHeight: 1000,
          height: 900,
        }}
      >
        {address ? <h1 className={styles.text}>Good Morning {address}</h1> : <div></div>}
        {apiSecret && apiKey ? <h1 className={styles.text}>Good Morning {apiSecret} {apiKey}</h1> : <div></div>}
        <h3 className={styles.text}>Porfolio overview</h3>
        <div className={styles.cardContainer0}>
          <Card
            sx={{
              minWidth: 275,
              width: 532,
              height: 200,
              bgcolor: "#5EC2B7",
            }}>
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#ffff",
                }}
                variant="h5"
                component="div">
                Total Assets
              </Typography>
              <p> $ </p>
              <p> 1,234,567.90 </p>
              <p> USD </p>
            </CardContent>
          </Card>
        </div>

        <div className={styles.cardContainer1}>
          <Card
            sx={{
              minWidth: 275,
              height: 200,
              bgcolor: "#5D55A6",
            }}>
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#ffff",
                }}
                color="text.secondary"
                gutterBottom>
                Tokens
              </Typography>
              <Typography variant="body2">
                <div className={styles.tokensAmount}>
                  3,000<span className={styles.tokensFont}>Tokens</span>
                </div>
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className={styles.cardContainer2}>
          <Card
            sx={{
              width: 50,
              height: 200,
              bgcolor: "#E46E7E",
              minWidth: 205,
            }}>
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#ffff",
                }}
                color="text.secondary"
                gutterBottom>
                Portfolios
              </Typography>
              <Typography variant="body2">
                <div className={styles.portfolioFont}>10</div>
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className={styles.cardConainer3}>
          <Card
            sx={{
              width: 208,
              height: 416,
              bgcolor: "#364652",
              minWidth: 431
            }}>
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#ffff",
                }}
                color="text.secondary"
                gutterBottom>
                Assets Distributions
              </Typography>

              <div className={styles.piechartContainer}>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <img
                    className={styles.piechartImg}
                    src="/pieChart.png"
                    alt="pieChart"
                  />
                </Typography>
                <Typography variant="body2">
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
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>

        <br />

        {loading ? <img className={styles.loading} src="/loading.gif" /> :

          <div className={styles.TableContainer}>
            <TableContainer component={Paper}>
              <Table
                sx={{
                  bgcolor: "#364652",
                  minWidth: 975,
                }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow className={styles.tableRow}>
                    <TableCell className={styles.tableRow}>Asset Name</TableCell>
                    <TableCell className={styles.tableRow}>Symbol</TableCell>
                    <TableCell className={styles.tableRow} align="right">Balance</TableCell>
                    <TableCell className={styles.tableRow} align="right">Price (USD)</TableCell>
                    <TableCell className={styles.tableRow} align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.assetName}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, }}
                    >
                      <TableCell
                        className={styles.tableRow}
                        component="th"
                        scope="row"
                      >
                        {row.assetName}
                      </TableCell>
                      <TableCell className={styles.symbol} align="right">{row.symbol}</TableCell>
                      <TableCell className={styles.tableRow} align="right">{row.balance !== 0 ? row.balance : "-"}</TableCell>
                      <TableCell className={styles.tableRow} align="right">{row.price !== 0 ? row.price : "-"}</TableCell>
                      <TableCell className={styles.tableRow} align="right">{row.value !== 0 ? "$ " + row.value : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        }
      </Box>
    </Box>
  );
};

export default Dashboard;
