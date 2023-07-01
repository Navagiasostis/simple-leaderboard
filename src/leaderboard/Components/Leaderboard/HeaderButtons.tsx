import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SortIcon from "@mui/icons-material/Sort";
import { Contestant } from "../../Models/Contestant";
import { useContext } from "react";
import { RaceDataContext } from "./Leaderboard";
import PointsDialog from "./PointsDialog";
import AddRound from "./AddRoundDialog";

function HeaderButtons() {
    const contextData = useContext(RaceDataContext);
    const [contestants, setContestants] = contextData!.contestants;
    const addContestant = () => {
        const newContestant: Contestant = {
            id: crypto.randomUUID(),
            name: "",
            points: 0,
            roundData: []
        };
        setContestants([...contestants, newContestant]);
    };

    const sortParticipants = () => {
        const unsortedContestants = [...contestants];
        const sortedContestants = unsortedContestants.sort((a, b) =>
            a.points > b.points ? -1 : 1
        );
        setContestants(sortedContestants);
    };

    return (
        <div
            style={{
                marginTop: "5px",
                marginBottom: "5px",
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
                display: "flex",
                flexDirection: "row"
            }}
        >
            <Button
                color="info"
                variant="contained"
                onClick={addContestant}
                startIcon={<PersonAddIcon />}
            >
                Add Participant
            </Button>
            <AddRound />
            <Button
                color="secondary"
                variant="contained"
                onClick={sortParticipants}
                startIcon={<SortIcon />}
            >
                Sort Participants
            </Button>
            <PointsDialog />
        </div>
    );
}
export default HeaderButtons;
