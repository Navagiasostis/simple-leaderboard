import React, { useMemo, useState } from "react";

import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { Contestant } from "../Models/Contestant";
import { PointsPerPosition } from "../Models/PointsPerPosition";
import { Round } from "../Models/Round";
import { Button } from "@mui/material";
import "../Styles/Global.css";
import SortIcon from "@mui/icons-material/Sort";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import { type MRT_Cell } from "material-react-table";

import { Typography } from "@mui/material";

type GridProps = {
  contestants: Contestant[];
  setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>;
  rounds: Round[];
  setRounds: React.Dispatch<React.SetStateAction<Round[]>>;
  pointsPerPosition: PointsPerPosition[];
  setPointsPerPosition: React.Dispatch<React.SetStateAction<PointsPerPosition[]>>;
};

//nested data is ok, see accessorKeys in ColumnDef below

const Grid = ({ contestants, setContestants, rounds, setRounds, pointsPerPosition }: GridProps) => {
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
  //should be memoized or stable

  const roundColumns = () => {
    const columns: MRT_ColumnDef<Contestant>[] = [];
    rounds.forEach((round) => {
      const newColumn: MRT_ColumnDef<Contestant> = {
        header: round.name,
        accessorKey: round.id as keyof Contestant,
      };
      columns.push(newColumn);
    });
    return columns;
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation

        header: "Name",
      },

      {
        accessorKey: "points", //normal accessorKey

        header: "Points",
      },
    ],
    roundColumns()
  );

  const [tableData, setTableData] = useState<Contestant[]>(() => contestants);

  const handleSaveCell = (cell: MRT_Cell<Contestant>, value: any) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here

    console.log(cell.column.id);
    console.log(tableData[cell.row.index][cell.column.id as keyof Contestant]);

    //send/receive api updates here

    setTableData([...tableData]); //re-render with new data
  };

  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((c) => c.accessorKey as string));

  const handleAddNewColumn = () => {
    const newColumnPropmpt = window.prompt("Enter new column's name:");
    const newColumns = [...columns];
    newColumns.splice(1, 0, {
      accessorKey: newColumnPropmpt ?? "",
      header: newColumnPropmpt?.toUpperCase() ?? "",
    });
    //setColumns(newColumns);
    setColumnOrder(newColumns.map((c) => c.accessorKey as string));
  };

  return (
    <>
      <Button color="success" variant="contained" onClick={addContestant} startIcon={<PersonAddIcon />}>
        Add Participant
      </Button>
      <Button color="success" variant="contained" onClick={addRound} startIcon={<AddLocationAltIcon />}>
        Add Round
      </Button>
      <Button color="secondary" variant="contained" onClick={sortParticipants} startIcon={<SortIcon />}>
        Sort Participants
      </Button>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        editingMode="cell"
        enableEditing
        muiTableBodyCellEditTextFieldProps={({ cell }) => ({
          //onBlur is more efficient, but could use onChange instead
          // onBlur: (event) => {
          //   handleSaveCell(cell, event.target.value);
          // },
        })}
        renderBottomToolbarCustomActions={() => (
          <Typography sx={{ fontStyle: "italic", p: "0 1rem" }} variant="body2">
            Double-Click a Cell to Edit
          </Typography>
        )}
      />
    </>
  );
};

export default Grid;
