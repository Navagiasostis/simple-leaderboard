import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import { useContext, useState } from "react";
import { Round } from "../../Models/Round";
import { RoundData } from "../../Models/RoundData";
import { RaceDataContext } from "./Leaderboard";

function AddRound() {
    const [roundDialogOpen, setRoundDialogOpen] = useState<boolean>(false);
    const contextData = useContext(RaceDataContext);
    const [contestants, setContestants] = contextData!.contestants;
    const [rounds, setRounds] = contextData!.rounds;
    const defaultTracks = [
        "Assetto Corsa",
        "Assetto Corsa Competizione",
        "iRacing",
        "RaceRoom",
        "rFactor",
        "Le Mans Ultimate"
    ];
    const [trackOptions, setTrackOptions] = useState<string[]>(defaultTracks);
    const [selectedTrack, setSelectedTrack] = useState<string>(
        defaultTracks[0]
    );
    const [customTrackName, setCustomTrackName] = useState<string>("");

    const addRound = () => {
        const roundName =
            selectedTrack === "__ADD_NEW__"
                ? customTrackName.trim()
                : selectedTrack;

        if (!roundName) {
            return;
        }

        const trimmedRoundName = roundName;

        if (
            selectedTrack === "__ADD_NEW__" &&
            trimmedRoundName &&
            !trackOptions.includes(trimmedRoundName)
        ) {
            setTrackOptions([...trackOptions, trimmedRoundName]);
        }

        const newRound: Round = {
            id: crypto.randomUUID(),
            name: trimmedRoundName
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

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setSelectedTrack(event.target.value);
        if (event.target.value === "__ADD_NEW__") {
            setCustomTrackName("");
        }
    };

    const handleClose = () => {
        setRoundDialogOpen(false);
        setSelectedTrack(defaultTracks[0]);
        setCustomTrackName("");
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
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel id="track-select-label">
                            Select track or add new
                        </InputLabel>
                        <Select
                            labelId="track-select-label"
                            value={selectedTrack}
                            onChange={handleSelectChange}
                        >
                            {trackOptions.map((track) => (
                                <MenuItem key={track} value={track}>
                                    {track}
                                </MenuItem>
                            ))}
                            <MenuItem value="__ADD_NEW__">
                                Add new track
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {selectedTrack === "__ADD_NEW__" ? (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="custom-track-name"
                            label="New Track Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={customTrackName}
                            onChange={(event) =>
                                setCustomTrackName(event.target.value)
                            }
                        />
                    ) : null}
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
