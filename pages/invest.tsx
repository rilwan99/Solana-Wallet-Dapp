import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Invest.module.css";

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
import InsightsIcon from "@mui/icons-material/Insights";
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const drawerWidth = 240;

function createData(
  token: string,
  freqeuncy: string,
  amount: number,
  balance: number
) {
  return { token, freqeuncy, amount, balance };
}

const rows = [
  createData("Bitcoin (BTC)", "Weekly", 100, 0.004332),
  createData("Etheruem (ETH)", "Weekly", 100, 0.7575),
  createData("Solana (SOL)", "Weekly", 100, 23.3232),
];

export const Invest: React.FC = () => {
  const [address, setAddress] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [apiSecret, setApiSecret] = React.useState("");
  const router = useRouter();
  const pathNameChecker = router.asPath.slice(8, 15);
  const wallet = useWallet()
  const { connection } = useConnection()


  React.useEffect(() => {
    // User enters via entering address in input box OR phantom wallet
    if (pathNameChecker === "address") {
      const userAddress = router.asPath.slice(16);
      console.log("User address is " + userAddress);
      setAddress(userAddress);
    }

    // User enters via CEX wallet button
    else {
      const stop = router.asPath.indexOf("&");
      const userApiKey = router.asPath.slice(15, stop);

      const secretStart = stop + 11;
      const userApiSecret = router.asPath.slice(secretStart);

      setApiKey(userApiKey);
      setApiSecret(userApiSecret);
    }
  }, []);

  const handleClickPortfolio = (e) => {
    e.preventDefault();
    if (address) {
      const url = "/portfolio?address=" + address;
      router.push(url);
    } else if (apiKey && apiSecret) {
      const url = "/portfolio?apiKey=" + apiKey + "&portfolio=" + apiSecret;
      router.push(url);
    }
  };

  const handleClickDashboard = (e) => {
    e.preventDefault();
    if (address) {
      const url = "/dashboard?address=" + address;
      router.push(url);
    } else if (apiKey && apiSecret) {
      const url = "/dashboard?apiKey=" + apiKey + "&apiSecret=" + apiSecret;
      router.push(url);
    }
  };

  const executeDCA = (e) => {

    e.preventDefault()

    const transaction = new web3.Transaction()
    const recipientPubKey = new web3.PublicKey("FY8z4UnMDBMRGHbqL8sRtjDEfs5W7J7jYpVvUGVceSTD")

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipientPubKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.1
    })

    transaction.add(sendSolInstruction);
    console.log("transaction", transaction)
    console.log("wallet", wallet)
    wallet.sendTransaction(transaction, connection).then(sig => {
      console.log(sig)
    })
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
            <ListItem key="DASHBOARD" disablePadding>
              <ListItemButton onClick={handleClickDashboard}>
                <ListItemIcon className={styles.menuItem}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText className={styles.menuItem} primary="DASHBOARD" />
              </ListItemButton>
            </ListItem>
            <ListItem key="PORTFOLIO" disablePadding>
              <ListItemButton onClick={handleClickPortfolio}>
                <ListItemIcon className={styles.menuItem}>
                  <LocalMallIcon />
                </ListItemIcon>
                <ListItemText className={styles.menuItem} primary="PORTFOLIO" />
              </ListItemButton>
            </ListItem>
            <ListItem key="INVESTMENT" disablePadding>
              <ListItemButton>
                <ListItemIcon className={styles.menuItemPrimary}>
                  <InsightsIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.menuItemPrimary}
                  primary="INVESTMENT"
                />
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
        <h1 className={styles.text}>Investment</h1>
        <h3 className={styles.text}>Investment overview</h3>
        <div className={styles.div0}>
          <div className={styles.diva1}>
            <Card
              sx={{
                minWidth: 475,
                width: 488,
                height: 150,
                bgcolor: "#5EC2B7",
              }}
            >
              <p className={styles.totalAsset}> Total Investment Amount <Tooltip title="Total Value of all trades executed via Automated DCA"><InfoIcon /></Tooltip></p>
              <CardContent>
                <div className={styles.totalassetContainer}>
                  <p className={styles.para1}>
                    {" "}
                    <span className={styles.currencyIcon}> $ </span>{" "}
                    <span className={styles.totalAmount}> 1200.00</span>{" "}
                    <span className={styles.dollarIcon}> USD </span>{" "}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className={styles.div3}>
              <div className={styles.tokenCont}>
                <Card
                  sx={{
                    minWidth: 475,
                    width: 488,
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
                      USDC Balance <Tooltip title="USDC Balance in current account"><InfoIcon /></Tooltip>
                    </Typography>
                    <div className={styles.tokensAmount}>
                      800
                      {" "}<span className={styles.tokensFont}>USDC</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className={styles.portfolioCont}>
                <Card
                  sx={{
                    minWidth: 475,
                    width: 488,
                    height: 150,
                    bgcolor: "#E46E7E",
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
                      Ongoing Investments <Tooltip title="Number of Automated DCA trades left"><InfoIcon /></Tooltip>
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
                height: 459,
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
                  Recurring Trade
                </Typography>

                <div>
                  <p className={styles.paraRtrade}>Frequency</p>
                  <FormControl sx={{ color: "#ffff", minWidth: 420 }}>
                    <Select
                      //   sx={{ color: "#ffff" }}
                      className={styles.borderDropdown}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Daily</MenuItem>
                      <MenuItem value={20}>Weekly</MenuItem>
                      <MenuItem value={30}>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <p className={styles.paraRtrade}>Token</p>
                  <FormControl
                    sx={{ color: "#ffff", minWidth: 420, maxWidth: 420 }}
                  >
                    <Select
                      className={styles.borderDropdown}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10} sx={{ maxWidth: 420 }}>
                        <img src="/bitcoin.png" className={styles.tokenIcon} />
                        Bitcoin (BTC)
                      </MenuItem>
                      <MenuItem value={20} sx={{ maxWidth: 420 }}>
                        <img src="/ethereum.png" className={styles.tokenIcon} />
                        Etheruem (ETH)
                      </MenuItem>
                      <MenuItem value={30} sx={{ maxWidth: 420 }}>
                        <img src="/solana.png" className={styles.tokenIcon} />
                        Solana (SOL)
                      </MenuItem>
                    </Select>
                    {/* <FormHelperText>Without label</FormHelperText> */}
                  </FormControl>
                </div>
                <div>
                  <div className={styles.radioButtton}>
                    <p className={styles.paraRtrade}>Amount (USDC)</p>

                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel value="10" control={<Radio sx={{ color: "#ffff" }} />} label="10" />
                      <FormControlLabel value="100" control={<Radio sx={{ color: "#ffff" }} />} label="100" />
                      <FormControlLabel value="1000" control={<Radio sx={{ color: "#ffff" }} />} label="1000" />

                    </RadioGroup>
                  </div>
                  <div>
                    <p className={styles.paraRtrade}>Trade Cycle</p>
                    <div>
                      <div className={styles.tradeCcontainer}>
                        <span className={styles.maxPara}>
                          <span className={styles.maxParaB}>MAX</span>
                        </span>
                        {/* <p className={styles.maxPara}>MAX</p> */}
                      </div>
                    </div>
                  </div>
                </div>
                <p></p>
                <div>
                  <Button onClick={executeDCA} variant="contained">submit</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <p></p>

        <div className={styles.TableContainer}>
          <div className={styles.assetDTitle}>Investment Details</div>
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
                  <TableCell className={styles.tableRow}>Token</TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Frequency
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Amount (in USDC)
                  </TableCell>
                  <TableCell className={styles.tableRow} align="right">
                    Balance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.token}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className={styles.tableRow}
                      component="th"
                      scope="row"
                    >
                      {row.token}
                    </TableCell>
                    <TableCell className={styles.symbol} align="right">
                      {row.freqeuncy}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.amount}
                    </TableCell>
                    <TableCell className={styles.tableRow} align="right">
                      {row.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </Box>
  );
};
export default Invest;
