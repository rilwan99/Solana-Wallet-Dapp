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
import { Card } from "@mui/material";

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

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

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
        <h1 className={styles.text}>Good Morning John</h1>
        <h3 className={styles.text}>Porfolio overview</h3>
        <div className={styles.cardContainer0}>
          <Card
            sx={{
              minWidth: 275,
              width: 532,
              height: 200,
              bgcolor: "#5EC2B7",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#ffff",
                }}
                variant="h5"
                component="div"
              >
                Total Assets
              </Typography>
              <Typography variant="body2">
                <div className={styles.totalAmount}>
                  <span className={styles.dollarIcon}>$</span>1,234,567.90
                  <span className={styles.currencyIcon}>USD</span>
                </div>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
        <div className={styles.cardConainer1}>
          <Card
            sx={{
              minWidth: 275,
              height: 200,
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
                <div className={styles.tokensAmount}>
                  3,000<span className={styles.tokensFont}>Tokens</span>
                </div>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
        <div className={styles.cardConainer2}>
          <Card
            sx={{
              width: 50,
              height: 200,
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
                Portfolios
              </Typography>
              <Typography variant="body2">
                <div className={styles.portfolioFont}>10</div>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
        <div className={styles.cardConainer3}>
          <Card
            sx={{
              width: 208,
              height: 416,
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
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
        <br />
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
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
