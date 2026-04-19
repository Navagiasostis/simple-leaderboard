import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ContestantRow } from "./ContestantRow";
import { useContext } from "react";
import { RaceDataContext } from "./Leaderboard";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

export const LeaderboardTable = () => {
    const contextData = useContext(RaceDataContext);
    const [contestants, setContestants] = contextData!.contestants;
    const [rounds] = contextData!.rounds;
    const [pointsPerPosition] = contextData!.pointsPerPosition;
    return (
        <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", width: "100%", display: "block" }}
        >
            <Table
                aria-label="customized table"
                sx={{ minWidth: "max-content" }}
            >
                <TableHead>
                    <TableRow>
                        <StyledTableCell
                            className="position_cell"
                            align="center"
                            sx={{
                                position: "sticky",
                                left: 0,
                                top: 0,
                                zIndex: 130,
                                minWidth: 50,
                                width: 50,
                                backgroundColor: "rgba(255,255,255,0.95)",
                                borderRight: "1px solid rgba(0,0,0,0.08)"
                            }}
                        >
                            Pos.
                        </StyledTableCell>
                        <StyledTableCell
                            className="name_cell"
                            align="center"
                            sx={{
                                position: "sticky",
                                left: 50,
                                top: 0,
                                zIndex: 130,
                                minWidth: 160,
                                width: 160,
                                backgroundColor: "rgba(255,255,255,0.95)",
                                borderRight: "1px solid rgba(0,0,0,0.08)"
                            }}
                        >
                            Name
                        </StyledTableCell>
                        {rounds.map((round) => (
                            <StyledTableCell key={round.id} align="center">
                                {round.name}
                            </StyledTableCell>
                        ))}
                        <StyledTableCell
                            className="points_cell"
                            align="center"
                            sx={{
                                position: "sticky",
                                right: 50,
                                top: 0,
                                zIndex: 130,
                                minWidth: 70,
                                width: 70,
                                backgroundColor: "rgba(255,255,255,0.95)",
                                borderLeft: "1px solid rgba(0,0,0,0.08)"
                            }}
                        >
                            Points
                        </StyledTableCell>
                        <StyledTableCell
                            className="delete_cell"
                            align="center"
                            sx={{
                                position: "sticky",
                                right: 0,
                                top: 0,
                                zIndex: 130,
                                minWidth: 50,
                                width: 50,
                                backgroundColor: "rgba(255,255,255,0.95)",
                                borderLeft: "1px solid rgba(0,0,0,0.08)"
                            }}
                        ></StyledTableCell>
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
    );
};
