import * as React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import NameInputField from "./NameInputField";
import NumberInputField from "./NumberInputField";
import { IconButton, InputAdornment } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Contestant } from "../../Models/Contestant";
import { PointsPerPosition } from "../../Models/PointsPerPosition";
import { Round } from "../../Models/Round";
import { RoundData } from "../../Models/RoundData";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0
    }
}));

type ContestantRowProps = {
    contestant: Contestant;
    position: number;
    contestants: Contestant[];
    setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>;
    rounds: Round[];
    pointsPerPosition: PointsPerPosition[];
};

export const ContestantRow = ({
    contestant,
    position,
    contestants,
    setContestants,
    rounds,
    pointsPerPosition
}: ContestantRowProps) => {
    const handleNameChange = (name: string, contestantId: string) => {
        const updatedContestants = contestants.map((person) =>
            person.id === contestant.id ? { ...person, name: name } : person
        );
        setContestants(updatedContestants);
    };

    React.useEffect(() => {
        recalculatePoints();
    }, [pointsPerPosition]);

    const handleRoundPositionChange = (
        updatedPosition: number,
        contestantId: string,
        roundId: string
    ) => {
        const contestantToEdit = contestants.find(
            (contestant) => contestant.id === contestantId
        )!;
        const updatedValues = updatePoints(
            contestantToEdit,
            updatedPosition,
            roundId
        );
        if (updatedValues?.updatedRoundData) {
            const updatedContestants = contestants.map((person) =>
                person.id === contestantToEdit.id
                    ? {
                          ...person,
                          points: updatedValues.points,
                          roundData: updatedValues.updatedRoundData
                      }
                    : person
            );
            setContestants(updatedContestants);
        }
    };

    const recalculatePoints = () => {
        //memoisation?????
        const updatedContestants = contestants.map((person) => {
            person.points = 0;
            person.roundData.forEach((round) => {
                person.points +=
                    pointsPerPosition.find(
                        (position) => position.position === round.position
                    )?.points ?? 0;
            });
            return person;
        });

        setContestants(updatedContestants);
    };

    const updatePoints = (
        contestant: Contestant,
        updatedPosition: number,
        roundId: string
    ) => {
        const updatedRoundData: RoundData[] = [...contestant.roundData];
        const currentRoundIndex = updatedRoundData.findIndex(
            (data) => data.roundId === roundId
        );
        const currentRoundData =
            currentRoundIndex >= 0 ? updatedRoundData[currentRoundIndex] : null;
        const newPosition = pointsPerPosition.find(
            (pos) => updatedPosition === pos.position
        );
        const newPoints = newPosition?.points ?? 0;
        let points = contestant.points;

        if (!currentRoundData) {
            const newRoundData: RoundData = {
                roundId,
                position: updatedPosition
            };
            updatedRoundData.push(newRoundData);
            points = contestant.points + newPoints;
            return { points, updatedRoundData };
        }

        const previousPosition = pointsPerPosition.find(
            (pos) => currentRoundData.position === pos.position
        );
        const previousPoints = previousPosition?.points ?? 0;
        points = contestant.points - previousPoints + newPoints;
        updatedRoundData[currentRoundIndex] = {
            ...currentRoundData,
            position: updatedPosition
        };
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
            <StyledTableRow key={contestant.id}>
                <StyledTableCell
                    className="position_cell"
                    align="center"
                    sx={{
                        position: "sticky",
                        left: 0,
                        zIndex: 120,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRight: "1px solid rgba(0,0,0,0.08)"
                    }}
                >
                    {position + 1}
                </StyledTableCell>
                <StyledTableCell
                    className="name_cell"
                    align="center"
                    sx={{
                        position: "sticky",
                        left: 50,
                        zIndex: 120,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRight: "1px solid rgba(0,0,0,0.08)"
                    }}
                >
                    <NameInputField
                        label={"Name"}
                        value={contestant.name}
                        onChange={function (value: string): void {
                            handleNameChange(value, contestant.id);
                        }}
                        additionalProps={{
                            placeholder: "Participator's name",
                            size: "small",
                            style: { minWidth: 120, maxWidth: 180 }
                        }}
                    />
                </StyledTableCell>
                {rounds.map((round, roundIndex) => (
                    <StyledTableCell className="round_cell" align="center">
                        {
                            <NumberInputField
                                label={"Position"}
                                value={
                                    contestant.roundData.find(
                                        (contestantRound) =>
                                            contestantRound.roundId === round.id
                                    )?.position ?? 0
                                }
                                onChange={function (value: string): void {
                                    handleRoundPositionChange(
                                        Number(value),
                                        contestant.id,
                                        round.id
                                    );
                                }}
                                additionalProps={{
                                    size: "small",
                                    sx: { maxWidth: "80px" },
                                    placeholder: "Participator's position",
                                    InputProps: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {pickAdornment(
                                                    contestant.roundData.find(
                                                        (contestantRound) =>
                                                            contestantRound.roundId ===
                                                            round.id
                                                    )?.position ?? 0
                                                )}
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        }
                    </StyledTableCell>
                ))}
                <StyledTableCell
                    className="points_cell"
                    align="center"
                    sx={{
                        position: "sticky",
                        right: 50,
                        zIndex: 120,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderLeft: "1px solid rgba(0,0,0,0.08)"
                    }}
                >
                    {contestant.points}
                </StyledTableCell>
                <StyledTableCell
                    className="delete_cell"
                    align="center"
                    sx={{
                        position: "sticky",
                        right: 0,
                        zIndex: 120,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderLeft: "1px solid rgba(0,0,0,0.08)"
                    }}
                >
                    {
                        <IconButton
                            aria-label="delete"
                            onClick={deleteContestant}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                </StyledTableCell>
            </StyledTableRow>
        </>
    );
};
