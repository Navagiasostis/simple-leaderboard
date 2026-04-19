import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

function ResponsiveAppBar() {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ScoreboardIcon fontSize="large" />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".15rem",
                                color: "inherit",
                                textDecoration: "none"
                            }}
                        >
                            Racing Championship Leaderboard
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
