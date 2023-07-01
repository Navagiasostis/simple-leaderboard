import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { Round } from "../../Models/Round";
import { RoundData } from "../../Models/RoundData";
import { RaceDataContext } from "./Leaderboard";

function AddRound() {
    const [roundDialogOpen, setRoundDialogOpen] = useState<boolean>(false);
    const contextData = useContext(RaceDataContext);
    const [contestants, setContestants] = contextData!.contestants;
    const [rounds, setRounds] = contextData!.rounds;
    const roundName = useRef<HTMLInputElement>();

    const addRound = () => {
        const newRound: Round = {
            id: crypto.randomUUID(),
            name: roundName.current!.value
        };

        const updatedContestants = contestants.map((person) => {
            const newRoundData: RoundData = {
                position: 0,
                roundId: newRound.id
            };
            const updatedContestantRoundData = [
                ...person.roundData,
                newRoundData
            ];

            return { ...person, roundData: updatedContestantRoundData };
        });
        setRounds([...rounds, newRound]);
        setContestants(updatedContestants);

        handleClose();
    };

    const handleClose = () => {
        setRoundDialogOpen(false);
    };

    return (
        <>
            <Button
                color="success"
                variant="contained"
                onClick={() => setRoundDialogOpen(true)}
                startIcon={<AddLocationAltIcon />}
            >
                Add Round
            </Button>

            {/* Dialog for new Round */}
            <Dialog open={roundDialogOpen} onClose={handleClose}>
                <DialogTitle>Add new round</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Write the round's name bellow
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Round Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={roundName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addRound}>Save settings</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddRound;
