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
import { Button, InputAdornment, makeStyles } from "@mui/material";
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

export const LeaderboardTable = ({ contestants, setContestants, rounds, setRounds, pointsPerPosition }: LeaderboardProps) => {
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

  const addRound = () => {
    const newRound: Round = {
      id: crypto.randomUUID(),
      name: "",
    };
    setRounds([...rounds, newRound]);
  };

  const updateRound = (name: string, roundId: string) => {
    const roundToEdit = rounds.find((round) => round.id === roundId)!;
    const updatedRounds = rounds.map((round) => (round.id === roundToEdit.id ? { ...round, name: name } : round));
    setRounds(updatedRounds);
  };

  return (
    <>
      <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "space-evenly", width: "100%", alignItems: "center", display: "flex", flexDirection: "row" }}>
        <Button color="success" variant="contained" onClick={addContestant} startIcon={<PersonAddIcon />}>
          Add Participant
        </Button>
        <Button color="success" variant="contained" onClick={addRound} startIcon={<AddLocationAltIcon />}>
          Add Round
        </Button>
        <Button color="secondary" variant="contained" onClick={sortParticipants} startIcon={<SortIcon />}>
          Sort Participants
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow style={{ overflow: "scroll" }}>
              <StyledTableCell className="name_cell" align="center">
                Name
              </StyledTableCell>
              {rounds.map((round, index) => (
                <StyledTableCell key={round.id} align="center">
                  <NameInputField
                    label="Track Name"
                    onChange={function (value: string): void {
                      updateRound(String(value), round.id);
                    }}
                    value={round.name}
                  ></NameInputField>
                </StyledTableCell>
              ))}
              <StyledTableCell className="points_cell" align="center">
                Pts
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
