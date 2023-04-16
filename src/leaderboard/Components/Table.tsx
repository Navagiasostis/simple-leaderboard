import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Contestant } from '../Models/Contestant';
import { Round } from '../Models/Round';
import NameInputField from './NameInputField';
import NumberInputField from './NumberInputField';
import { PointsPerPosition } from '../Models/PointsPerPosition';
import { RoundData } from '../Models/RoundData';

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

type LeaderboardProps = {
  contestants: Contestant[]
  setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>
  rounds: Round[]
  setRounds: React.Dispatch<React.SetStateAction<Round[]>>
  pointsPerPosition: PointsPerPosition[]
  setPointsPerPosition: React.Dispatch<React.SetStateAction<PointsPerPosition[]>>
}


export const LeaderboardTable = ({contestants, setContestants, rounds, setRounds, pointsPerPosition, setPointsPerPosition}: LeaderboardProps) => {

  const addContestant = (contestantName: string, contestantNumber: number) => {
    const newContestant: Contestant = {
      id: crypto.randomUUID(),
      name: contestantName,
      points: 0,
      roundData: []
    };
    setContestants([...contestants, newContestant]);
  };

  const handleNameChange = (
    name: string,
    contestantId: string,
  ) => {
    const contestantToEdit = contestants.find(contestant => contestant.id == contestantId)!;
    const updatedContestants = contestants.map((person) =>
      person.id === contestantToEdit.id ? { ...person, name: name} : person
    );
    setContestants(updatedContestants);
  };

  const handleRoundPositionChange = (
    updatedPosition: number,
    contestantId: string,
    roundId: string
  ) => {
    const contestantToEdit = contestants.find(contestant => contestant.id == contestantId)!;
    const updatedValues = updatePoints(contestantToEdit, updatedPosition, roundId);
    const updatedContestants = contestants.map((person) =>
      person.id === contestantToEdit.id ? { ...person, points: updatedValues.points, roundData: updatedValues.updatedRoundData} : person
    );
    setContestants(updatedContestants);
  };

  const updatePoints = (contestant: Contestant, updatedPosition: number, roundId: string) => {
    const currentRoundData = contestant.roundData.find(data => data.roundId == roundId)!;
    const previousPosition = pointsPerPosition.find(pos => currentRoundData.position == pos.position);
    const newPosition = pointsPerPosition.find(pos => updatedPosition == pos.position);

    const updatedRoundData: RoundData[] = contestant.roundData;

    let points = contestant.points;
    debugger
    if(previousPosition && newPosition){
      points = contestant.points - previousPosition.points + newPosition.points;
      updatedRoundData.find(round => round.roundId == roundId)!.position = updatedPosition;
      
    } else if(newPosition){
      points = contestant.points + newPosition.points;
      updatedRoundData.find(round => round.roundId == roundId)!.position = updatedPosition;
    }

    return {points, updatedRoundData};
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Position</StyledTableCell>
            <StyledTableCell align="left">Name</StyledTableCell>
            {rounds.map((round, index) => (<StyledTableCell key={round.id} align="left">{round.name}</StyledTableCell>))}
            <StyledTableCell align="left">Total Points</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contestants.map((contestant, constestantIndex) => (
            <StyledTableRow key={contestant.id} sx={{maxWidth:"200px"}}>
              <StyledTableCell align="left">{constestantIndex + 1}</StyledTableCell>
              <StyledTableCell align="left"><NameInputField label={''} value={contestant.name} onChange={function (value: string): void {
                handleNameChange(value, contestant.id)
              } }/></StyledTableCell>
              {rounds.map((round, roundIndex) => (<StyledTableCell align="left">{
                <NumberInputField label={''} value={contestant.roundData.find(contestantRound => contestantRound.roundId == round.id)!.position} onChange={function (value: string): void {
                  handleRoundPositionChange(Number(value), contestant.id, round.id)
                }}/>
              }</StyledTableCell>))}
              <StyledTableCell align="left">{contestant.points}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}