import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Contestant } from "../Models/Contestant";
import { Round } from "../Models/Round";
import NameInputField from "./NameInputField";
import NumberInputField from "./NumberInputField";
import { PointsPerPosition } from "../Models/PointsPerPosition";
import { RoundData } from "../Models/RoundData";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, TextField, makeStyles } from "@mui/material";
import { ContestantRow } from "./ContestantRow";
import "../Styles/Global.css";
import SortIcon from "@mui/icons-material/Sort";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

type LeaderboardProps = {
  contestants: Contestant[];
  setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>;
  rounds: Round[];
  setRounds: React.Dispatch<React.SetStateAction<Round[]>>;
  pointsPerPosition: PointsPerPosition[];
  setPointsPerPosition: React.Dispatch<React.SetStateAction<PointsPerPosition[]>>;
};

export const LeaderboardTable = ({ contestants, setContestants, setRounds, rounds, pointsPerPosition, setPointsPerPosition }: LeaderboardProps) => {
  const [roundDialogOpen, setRoundDialogOpen] = React.useState<boolean>(false);
  const [pointsDialogOpen, setPointsDialogOpen] = React.useState<boolean>(false);
  const [roundName, setRoundName] = React.useState("");

  const sortParticipants = () => {
    const unsortedContestants = [...contestants];
    const sortedContestants = unsortedContestants.sort((a, b) => (a.points > b.points ? -1 : 1));
    setContestants(sortedContestants);
  };

  const addContestant = () => {
    const newContestant: Contestant = {
      id: crypto.randomUUID(),
      name: "",
      points: 0,
      roundData: [],
    };
    setContestants([...contestants, newContestant]);
  };

  const handleClose = () => {
    setRoundDialogOpen(false);
    setPointsDialogOpen(false);
  };

  const addRound = () => {
    const newRound: Round = {
      id: crypto.randomUUID(),
      name: roundName,
    };

    const updatedContestants = contestants.map((person) => {
      const newRoundData: RoundData = {
        position: 0,
        roundId: newRound.id,
      };
      const updatedContestantRoundData = [...person.roundData, newRoundData];

      return { ...person, roundData: updatedContestantRoundData };
    });

    setRounds([...rounds, newRound]);
    setContestants(updatedContestants);

    handleClose();
  };

  const updatePoints = (points: PointsPerPosition, value: string) => {
    const updatedPointsPerPosition = pointsPerPosition.map((pointData) => {
      if (pointData.position == points.position) {
        if (!isNaN(parseInt(value))) {
          points.points = parseInt(value);
        } else {
          points.points = 0;
        }
        return points;
      } else return pointData;
    });

    setPointsPerPosition(updatedPointsPerPosition);
  };

  return (
    <>
      <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "space-evenly", width: "100%", alignItems: "center", display: "flex", flexDirection: "row" }}>
        <Button color="info" variant="contained" onClick={addContestant} startIcon={<PersonAddIcon />}>
          Add Participant
        </Button>
        <Button color="success" variant="contained" onClick={() => setRoundDialogOpen(true)} startIcon={<AddLocationAltIcon />}>
          Add Round
        </Button>
        <Button color="secondary" variant="contained" onClick={sortParticipants} startIcon={<SortIcon />}>
          Sort Participants
        </Button>
        <Button color="warning" variant="contained" onClick={() => setPointsDialogOpen(true)} startIcon={<SortIcon />}>
          Customise Points Gain
        </Button>
        {/* Dialog for points customization */}
        <Dialog open={pointsDialogOpen} onClose={handleClose}>
          <DialogTitle>Customise points gained for each position</DialogTitle>
          <DialogContent>
            {pointsPerPosition.map((points) => (
              <div style={{ display: "flex" }}>
                <TextField autoFocus margin="dense" id="name" label="Position" type="text" fullWidth variant="standard" value={points.position} disabled />
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Points Gained"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={points.points}
                  onChange={(event) => updatePoints(points, event.target.value)}
                />
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addRound}>Add</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog for new Round */}
        <Dialog open={roundDialogOpen} onClose={handleClose}>
          <DialogTitle>Add new round</DialogTitle>
          <DialogContent>
            <DialogContentText>Write the round's name bellow</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Round Name"
              type="text"
              fullWidth
              variant="standard"
              value={roundName}
              onChange={(event) => setRoundName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addRound}>Save settings</Button>
          </DialogActions>
        </Dialog>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow style={{ overflow: "scroll" }}>
              <StyledTableCell className="position_cell" align="center">
                Pos.
              </StyledTableCell>
              <StyledTableCell className="name_cell" align="center">
                Name
              </StyledTableCell>
              {rounds.map((round, index) => (
                <StyledTableCell key={round.id} align="center">
                  {round.name}
                </StyledTableCell>
              ))}
              <StyledTableCell className="points_cell" align="center">
                Points
              </StyledTableCell>
              <StyledTableCell className="delete_cell" align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestants.map((contestant, constestantIndex) => (
              <ContestantRow
                contestant={contestant}
                position={constestantIndex}
                contestants={contestants}
                setContestants={setContestants}
                rounds={rounds}
                pointsPerPosition={pointsPerPosition}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
