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

import { Card } from "@mui/material";

const drawerWidth = 240;

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
                sx={{
                    height: "100%",
                    flexGrow: 1,
                    bgcolor: "#242F37",
                    p: 3,
                }}
            >
                <h1>Invest Page</h1>
            </Box>

        </Box>
    )
}
export default Invest;
