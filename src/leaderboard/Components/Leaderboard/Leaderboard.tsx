import {
    useState,
    useMemo,
    createContext,
    Dispatch,
    SetStateAction
} from "react";
import { Box, Paper, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Contestant } from "../../Models/Contestant";
import { PointsPerPosition } from "../../Models/PointsPerPosition";
import { Round } from "../../Models/Round";
import HeaderButtons from "./HeaderButtons";
import { LeaderboardTable } from "./Table";

type LeaderboardProps = {
    contestants: [
        contestants: Contestant[],
        setContestants: Dispatch<SetStateAction<Contestant[]>>
    ];
    rounds: [rounds: Round[], setRounds: Dispatch<SetStateAction<Round[]>>];
    pointsPerPosition: [
        pointsPerPosition: PointsPerPosition[],
        setPointsPerPosition: Dispatch<SetStateAction<PointsPerPosition[]>>
    ];
    championshipTitle: [string, Dispatch<SetStateAction<string>>];
    championshipDates: [string, Dispatch<SetStateAction<string>>];
};

export const RaceDataContext = createContext<LeaderboardProps | null>(null);

type LeaderboardInstanceProps = {
    title?: string;
    showRemove?: boolean;
    onRemove?: () => void;
};

export const Leaderboard = ({
    title = "Excel is mid",
    showRemove = false,
    onRemove
}: LeaderboardInstanceProps) => {
    const [championshipTitle, setChampionshipTitle] = useState(title);
    const [championshipDates, setChampionshipDates] = useState("");
    const [rounds, setRounds] = useState<Round[]>([]);
    const [pointsPerPosition, setPointsPerPosition] = useState<
        PointsPerPosition[]
    >([]);
    const [contestants, setContestants] = useState<Contestant[]>([
        { id: crypto.randomUUID(), name: "Alex", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Thimios", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Theo", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Petros", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Letos", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Alexi", points: 0, roundData: [] },
        { id: crypto.randomUUID(), name: "Takis", points: 0, roundData: [] }
    ]);
    const RaceData = useMemo(() => {
        return {
            rounds: [rounds, setRounds],
            pointsPerPosition: [pointsPerPosition, setPointsPerPosition],
            contestants: [contestants, setContestants],
            championshipTitle: [championshipTitle, setChampionshipTitle],
            championshipDates: [championshipDates, setChampionshipDates]
        } as LeaderboardProps;
    }, [
        rounds,
        pointsPerPosition,
        contestants,
        championshipTitle,
        championshipDates
    ]);
    return (
        <>
            <RaceDataContext.Provider value={RaceData}>
                <Paper
                    elevation={8}
                    sx={{
                        p: 3,
                        background:
                            "linear-gradient(180deg, rgba(245,246,248,1) 0%, rgba(222,234,246,1) 100%)"
                    }}
                >
                    <Box
                        sx={{
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: "100%", md: "auto" },
                                minWidth: 260
                            }}
                        >
                            <TextField
                                label="Championship name"
                                value={championshipTitle}
                                onChange={(event) =>
                                    setChampionshipTitle(event.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Dates"
                                value={championshipDates}
                                onChange={(event) =>
                                    setChampionshipDates(event.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                size="small"
                                helperText="Enter the event dates"
                            />
                        </Box>
                        {showRemove && onRemove ? (
                            <IconButton
                                color="error"
                                onClick={onRemove}
                                aria-label="Remove championship"
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <HeaderButtons />
                    </Box>
                    <LeaderboardTable />
                </Paper>
            </RaceDataContext.Provider>
        </>
    );
};
