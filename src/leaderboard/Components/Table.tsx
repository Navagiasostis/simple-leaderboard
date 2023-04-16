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
  rounds: number[]
  setRounds: React.Dispatch<React.SetStateAction<number[]>>
}


export const LeaderboardTable = ({contestants, setContestants, rounds, setRounds}: LeaderboardProps) => {

  const addContestant = (contestantName: string, contestantNumber: number) => {
    const newContestant: Contestant = {
      id: crypto.randomUUID(),
      name: contestantName,
      number: contestantNumber,
      points: 0
    };
    setContestants([...contestants, newContestant]);
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newContestants = [...contestants];
    newContestants[index].name = e.target.value;
    setContestants(newContestants);
  };

  const handlePointsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newContestants = [...contestants];
    newContestants[index].points = Number(e.target.value);
    setContestants(newContestants);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Position</StyledTableCell>
            <StyledTableCell align="left">Name</StyledTableCell>
            {rounds.map((round, index) => (<StyledTableCell align="left">{round}</StyledTableCell>))}
            <StyledTableCell align="left">Total Points</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contestants.map((contestant, index) => (
            <StyledTableRow key={contestant.id} sx={{maxWidth:"200px"}}>
              <StyledTableCell align="left">{index + 1}</StyledTableCell>
              <StyledTableCell align="left">{contestant.name}</StyledTableCell>
              {rounds.map((round, index) => (<StyledTableCell align="left">{round}</StyledTableCell>))}
              <StyledTableCell align="left">{contestant.points}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}