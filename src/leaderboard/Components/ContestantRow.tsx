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
import { Button, IconButton, InputAdornment } from "@mui/material";
import "../Styles/Global.css";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type ContestantRowProps = {
  contestant: Contestant;
  position: number;
  contestants: Contestant[];
  setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>;
  rounds: Round[];
  pointsPerPosition: PointsPerPosition[];
};

export const ContestantRow = ({ contestant, position, contestants, setContestants, rounds, pointsPerPosition }: ContestantRowProps) => {
  const handleNameChange = (name: string, contestantId: string) => {
    const updatedContestants = contestants.map((person) => (person.id === contestant.id ? { ...person, name: name } : person));
    setContestants(updatedContestants);
  };

  React.useEffect(() => {
    recalculatePoints();
  }, [pointsPerPosition]);

  const handleRoundPositionChange = (updatedPosition: number, contestantId: string, roundId: string) => {
    const contestantToEdit = contestants.find((contestant) => contestant.id === contestantId)!;
    const updatedValues = updatePoints(contestantToEdit, updatedPosition, roundId);
    if (updatedValues?.points && updatedValues.updatedRoundData) {
      const updatedContestants = contestants.map((person) =>
        person.id === contestantToEdit.id ? { ...person, points: updatedValues.points, roundData: updatedValues.updatedRoundData } : person
      );
      setContestants(updatedContestants);
    }
  };

  const recalculatePoints = () => {
    const updatedContestants = contestants.map((person) => {
      person.points = 0;
      person.roundData.forEach((round) => {
        person.points += pointsPerPosition.find((position) => position.position == round.position)!.points;
      });
      return person;
    });

    setContestants(updatedContestants);
  };

  const updatePoints = (contestant: Contestant, updatedPosition: number, roundId: string) => {
    const currentRoundData = contestant.roundData.find((data) => data.roundId === roundId);
    const newPosition = pointsPerPosition.find((pos) => updatedPosition === pos.position);
    const updatedRoundData: RoundData[] = contestant.roundData;
    let points = contestant.points;

    if (!currentRoundData && newPosition) {
      points = contestant.points + newPosition.points;
      const newRoundData: RoundData = { roundId: roundId, position: updatedPosition };
      updatedRoundData.push(newRoundData);
      return { points, updatedRoundData };
    }
    if (!currentRoundData) return;
    const previousPosition = pointsPerPosition.find((pos) => currentRoundData!.position === pos.position);
    if (previousPosition && newPosition) {
      points = contestant.points - previousPosition.points + newPosition.points;
      updatedRoundData.find((round) => round.roundId === roundId)!.position = updatedPosition;
    } else if (newPosition) {
      points = contestant.points + newPosition.points;
      updatedRoundData.find((round) => round.roundId === roundId)!.position = updatedPosition;
    }

    return { points, updatedRoundData };
  };

  const pickAdornment = (position: number) => {
    const currentPos = position.toString();
    if (currentPos.endsWith("1")) {
      return "st";
    } else if (currentPos.endsWith("2")) {
      return "nd";
    } else if (currentPos.endsWith("3")) {
      return "rd";
    } else {
      return "th";
    }
  };

  const deleteContestant = () => {
    setContestants(
      contestants.filter((person) => {
        return person !== contestant;
      })
    );
  };

  return (
    <>
      <StyledTableRow style={{ overflow: "scroll" }} key={contestant.id} sx={{ maxWidth: "200px" }}>
        <StyledTableCell className="position_cell" align="center">
          {position + 1}
        </StyledTableCell>
        <StyledTableCell className="name_cell" align="center">
          <NameInputField
            label={"Name"}
            value={contestant.name}
            onChange={function (value: string): void {
              handleNameChange(value, contestant.id);
            }}
            additionalProps={{ placeholder: "Participator's name", style: {} }}
          />
        </StyledTableCell>
        {rounds.map((round, roundIndex) => (
          <StyledTableCell className="round_cell" align="center">
            {
              <NumberInputField
                label={"Position"}
                value={contestant.roundData.find((contestantRound) => contestantRound.roundId === round.id)?.position ?? 0}
                onChange={function (value: string): void {
                  handleRoundPositionChange(Number(value), contestant.id, round.id);
                }}
                additionalProps={{
                  sx: { maxWidth: "100px" },
                  placeholder: "Participator's position",
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">{pickAdornment(contestant.roundData.find((contestantRound) => contestantRound.roundId === round.id)?.position ?? 0)}</InputAdornment>
                    ),
                  },
                }}
              />
            }
          </StyledTableCell>
        ))}
        <StyledTableCell className="points_cell" align="center">
          {contestant.points}
        </StyledTableCell>
        <StyledTableCell className="delete_cell" align="center">
          {
            <IconButton aria-label="delete" onClick={deleteContestant}>
              <DeleteIcon />
            </IconButton>
          }
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
