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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";

const drawerWidth = 240;

function createData(
    token: string,
    freqeuncy: number,
    amount: number,
    balance: number,
) {
    return { token, freqeuncy, amount, balance };
}

const rows = [
    createData('Bitcoin (BTC)', "Weekly", 100, 0.004332),
    createData('Etheruem (ETH)', "Weekly", 100, 0.004332),
    createData('Solana (SOL)', "Weekly", 100, 0.004332),
    createData('Bitcoin (BTC)', "Weekly", 100, 0.004332),
    createData('Bitcoin (BTC)', "Weekly", 100, 0.004332),
];

export const Invest: React.FC = () => {


    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
            }}>

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
                // component="main"
                sx={{
                    height: "100%",
                    flexGrow: 1,
                    bgcolor: "#242F37",
                    p: 3,
                }}
            >
                <h1>Invest Page</h1>
                <h3 className={styles.text}>Investment overview</h3>
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
                            <p className={styles.totalAsset}> Total Amount Invest</p>
                            <CardContent>
                                <div className={styles.totalassetContainer}>
                                    <p className={styles.para1}>
                                        {" "}
                                        <span className={styles.currencyIcon}> $ </span>{" "}
                                        <span className={styles.totalAmount}>
                                            {" "}
                                            1234
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
                                            USDC Balance
                                        </Typography>
                                        <div className={styles.tokensAmount}>
                                            12333443
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
                                            Ongoing Trade
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
                                    Assets Distributions
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
                                    <TableCell className={styles.tableRow}>
                                        Token
                                    </TableCell>
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
                                            {row.frequency}
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            {row.amount}
                                        </TableCell>
                                        <TableCell className={styles.tableRow} align="right">
                                            {row.balance}
                                        </TableCell>
                                        =
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </Box>

        </Box>
    )
}
export default Invest;
