import "./App.css";
import ResponsiveAppBar from "./leaderboard/Components/AppBar";
import { Leaderboard } from "./leaderboard/Components/Leaderboard/Leaderboard";
import { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

function App() {
    const [championships, setChampionships] = useState<string[]>([
        crypto.randomUUID()
    ]);

    const addChampionship = () => {
        setChampionships([...championships, crypto.randomUUID()]);
    };

    const removeChampionship = (id: string) => {
        setChampionships(
            championships.filter((championship) => championship !== id)
        );
    };

    // useEffect(() => {
    //   const numberOfAvailablePositions = contestants.length;
    //   const newPositions: PointsPerPosition[] = [];

    //   for (let i = 0; i <= numberOfAvailablePositions; i++) {
    //     if (pointsPerPosition.map((position) => position.position != i)) {
    //       const newPosition: PointsPerPosition = {
    //         position: i,
    //         points: 0,
    //       };
    //       setPointsPerPosition([...pointsPerPosition, newPosition]);
    //     }
    //   }
    // }, [contestants.length]);

    return (
        <>
            <header>
                <ResponsiveAppBar />
            </header>
            <main>
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" component="h2">
                            Championships
                        </Typography>
                        <Button variant="contained" onClick={addChampionship}>
                            Add Championship
                        </Button>
                    </Box>
                    <Stack spacing={4}>
                        {championships.map((id, index) => (
                            <Leaderboard
                                key={id}
                                title={`Championship ${index + 1}`}
                                showRemove
                                onRemove={() => removeChampionship(id)}
                            />
                        ))}
                    </Stack>
                </Container>
            </main>
        </>
    );
}

export default App;
