import * as React from "react";
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
import Image from "next/image";
import styles from "../styles/Dashboard.module.css";
import { Card, Grid } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { CenterFocusStrong, PieChart } from "@mui/icons-material";
import { style } from "@mui/system";

const drawerWidth = 240;

export const Dashboard: React.FC = () => {
  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

<<<<<<< HEAD
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    ></Box>
  );
=======
    if (pathNameChecker === "address") {
      const userAddress = router.asPath.slice(19)
      setAddress(userAddress)
      console.log("HIT 2")
      submitAddress(userAddress)
    }

    else {
      const stop = router.asPath.indexOf("&")
      const userApiKey = router.asPath.slice(18, stop)

      const secretStart = stop + 11
      const userApiSecret = router.asPath.slice(secretStart)

      setApiKey(userApiKey)
      setApiSecret(userApiSecret)
      getExchangeBal(apiKey,apiSecret)
      // Insert Function to populate component using fetched data
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
    const existingRows = rows ? [] : rows

    // Ierate through list of token accounts with non-zero balances
    for (let i = 0; i < currentTokenAccounts.length; i++) {

      // Find the mint address
      const mintAddress = new web3.PublicKey(currentTokenAccounts[i].mint).toString()

      // Call Solanafm API
      const tokenMeta = await getTokenName(mintAddress)

      // Find the token account balance 
      const tokenPubKey = tokenAccounts.value[i].pubkey
      const tokenBalanceData = (await connection.getTokenAccountBalance(tokenPubKey, "finalized")).value
      const decimals = Math.pow(10, tokenBalanceData.decimals)
      const balance = Number(currentTokenAccounts[i].amount) / decimals

      console.log("------------------------------------")
      existingRows.push(createData(tokenMeta.name, tokenMeta.abbreviation, balance, 0, 0))
      // setRows(existingRows)
    }
    setRows(existingRows)

  }


  async function getPrices() {
    let tokenSymbols: string[] = []
    rows.forEach(tokenInfo => tokenSymbols.push(tokenInfo.symbol))
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

  async function getExchangeBal(apiKey, apiSecret) {
    //event.preventDefault();
    const client = new RestClient(apiKey, apiSecret);
    try {
      let a = await client.getBalances();
      const result = a.result
      const nonZeroBalance = result.filter(account => account.total > 0)
      console.log(nonZeroBalance)
      // console.log(a.result[5].total);
    } catch (e) {
      console.error('Get balance failed: ', e);
    }
  }
>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e

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
          maxHeight: 900,
          height: 850,
        }}
      >
        <h1 className={styles.text}>Good Morning John</h1>
        <h3 className={styles.text}>Porfolio overview</h3>
        <div className={styles.cardContainer0}>
          <Card
            sx={{
              minWidth: 275,
              width: 432,
              height: 120,
              bgcolor: "#5EC2B7",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#ffff",
                }}
                variant="h5"
                component="div"
              >
                Total Assets
              </Typography>
              <Typography variant="body2">
                <p className={styles.dollarIcon}>$</p>
                <p className={styles.amount}> 1,234,567.90 </p>
                <p className={styles.currencyIcon}>USD</p>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small"></Button>
            </CardActions>
          </Card>
        </div>
<<<<<<< HEAD
        <div className={styles.cardConainer1}>
=======

        <div className={styles.cardContainer1}>
>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e
          <Card
            sx={{
              minWidth: 275,
              height: 120,
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
                Tokens
              </Typography>
              <Typography variant="body2">
                <p className={styles.tokensAmount}> 3,000 </p>
                <p className={styles.tokensFont}>Tokens</p>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small"></Button>
            </CardActions>
          </Card>
        </div>
<<<<<<< HEAD
        <div className={styles.cardConainer2}>
=======

        <div className={styles.cardContainer2}>
>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e
          <Card
            sx={{
              width: 25,
              height: 120,
              bgcolor: "#E46E7E",
              minWidth: 145,
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
                Portfolios
              </Typography>
              <Typography variant="body2">
                <p className={styles.portfolioFont}>10</p>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small"></Button>
            </CardActions>
          </Card>
        </div>
<<<<<<< HEAD
=======

>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e
        <div className={styles.cardConainer3}>
          <Card
            sx={{
              width: 108,
              height: 248,
              bgcolor: "#364652",
              minWidth: 431,
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
                Assets Distributions
              </Typography>
<<<<<<< HEAD
=======

>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e
              <div className={styles.piechartContainer}>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <img
                    className={styles.piechartImg}
                    src="/pieChart.png"
                    alt="pieChart"
                  />
                </Typography>
                <Typography variant="body2">
                  {/* <p className={styles.solFonts}>
                    <img className={styles.solImg} src="/sol.png" alt="sol" />
                    <p className={styles.solFont}> 50% - SOL </p>
                  </p> */}
                  <p className={styles.solFont}>
                    <img className={styles.solImg} src="/sol.png" alt="sol" />
                    50% - SOL
                  </p>
                  <p className={styles.solFont2}>
                    <img className={styles.solImg} src="/btc.png" alt="sol" />
                    30% - BTC
                  </p>
                  <p className={styles.solFont3}>
                    <img className={styles.solImg} src="/eth.png" alt="sol" />
                    15% - ETH
                  </p>
                  <p className={styles.solFont4}>
                    <img
                      className={styles.solImg2}
                      src="/other.png"
                      alt="sol"
                    />
                    5% - Others
                  </p>
                </Typography>
              </div>
            </CardContent>
<<<<<<< HEAD
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
=======
          </Card>
        </div>

>>>>>>> ab85d08e0223b7c8605c2672a565830949d9d51e
        <br />
        <div className={styles.TableContainer}>
          <p className={styles.tableAsset}>Assets Detail</p>
          <TableContainer component={Paper}>
            <Table
              sx={{
                bgcolor: "#364652",
                minWidth: 870,
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow className={styles.tableRow}>
                  <TableCell className={styles.tableRow}>
                    Dessert (100g serving)
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Calories
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Fat&nbsp;(g)
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Carbs&nbsp;(g)
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Protein&nbsp;(g)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      className={styles.tableRow}
                      component="th"
                      scope="row"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.calories}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.fat}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.carbs}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.protein}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid>
            {/* <Grid sx={{ pl: 2, pt: 1 }}>
              <FirstPageIcon />
              <KeyboardArrowLeftIcon />
            </Grid> */}
            <Grid className={styles.arrowFun}>
              <FirstPageIcon />
              <KeyboardArrowLeftIcon />
              <Typography>
                <p className={styles.numberPage}>1</p>
                <p className={styles.numberPage2}>of</p>
                <p className={styles.numberPage3}>500</p>
              </Typography>
              <Grid className={styles.arrowIcon}>
                <ChevronRightIcon />
                <LastPageIcon />
              </Grid>
            </Grid>
            {/* <Grid sx={{ pl: 22 }}>
              <ChevronRightIcon />
              <LastPageIcon />
            </Grid> */}
          </Grid>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
