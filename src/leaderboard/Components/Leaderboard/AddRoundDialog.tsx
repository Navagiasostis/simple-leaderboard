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
        "Adelaide Street Circuit",
        "Adria International Raceway",
        "Ahvenisto Race Circuit",
        "Algarve International Circuit",
        "Alton Towers",
        "Atlanta Motorsports Park",
        "Autodrom Most",
        "Autodromo dell’Umbria Magione",
        "Autodromo Enzo e Dino Ferrari Imola",
        "Autodromo Internazionale del Mugello",
        "Autodromo José Carlos Pace Interlagos",
        "Autodromo Nazionale di Monza",
        "Autodromo Nazionale Franco di Suni Mores",
        "Autodromo Piero Taruffi Vallelunga",
        "AVUS",
        "Bahrain International Circuit",
        "Barcelona-Catalunya",
        "Bathurst Mount Panorama",
        "Bilster Berg",
        "Black Cat County",
        "Brands Hatch",
        "Brianza 1966",
        "Brno Circuit",
        "Cadwell Park",
        "Chang International Circuit",
        "Charlotte Motor Speedway",
        "Circuit de Barcelona-Catalunya",
        "Circuit de Charade",
        "Circuit de la Sarthe Le Mans",
        "Circuit de Spa-Francorchamps",
        "Circuit Gilles Villeneuve Montreal",
        "Circuit of the Americas",
        "Circuit Paul Ricard",
        "Daytona International Speedway",
        "Donington Park",
        "Dubai Autodrome",
        "Eagle Creek",
        "Estoril Circuit",
        "Fuji Speedway",
        "Hockenheimring",
        "Hungaroring",
        "Indianapolis Motor Speedway",
        "Iowa Speedway",
        "Jacksonville Raceway",
        "Joesville Raceway",
        "Kyalami Grand Prix Circuit",
        "Laguna Seca",
        "Lausitzring",
        "Lime Rock Park",
        "Loch Drummond",
        "Longford 1967",
        "Losail International Circuit",
        "Lusail International Circuit",
        "Malaysia Sepang Circuit",
        "Mid-Ohio Sports Car Course",
        "Mills Metropark",
        "Misano World Circuit",
        "Monte Carlo 1966",
        "Mount Panorama",
        "Mountain Peak Raceway",
        "NOLA Motorsports Park",
        "Norisring",
        "Northside International Raceway",
        "Nürburgring",
        "Nürburgring Nordschleife",
        "Oschersleben",
        "Oulton Park",
        "Palm Beach International Raceway",
        "Palm Springs Raceway",
        "Portland International Raceway",
        "Portimão Algarve",
        "Quebec Super Karting",
        "Red Bull Ring",
        "Road America",
        "Road Atlanta",
        "Salzburgring",
        "Sao Paulo Historic",
        "Sardian Heights",
        "Sebring International Raceway",
        "Shanghai International Circuit",
        "Silverstone Circuit",
        "Snetterton Circuit",
        "Sonoma Raceway",
        "Spa-Francorchamps",
        "Suzuka Circuit",
        "Toban Raceway Park",
        "Twin Ring Motegi",
        "Valencia Ricardo Tormo Circuit",
        "Virginia International Raceway",
        "Watkins Glen International",
        "Zandvoort",
        "Zolder"
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
