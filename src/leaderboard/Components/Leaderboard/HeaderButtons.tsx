import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SortIcon from "@mui/icons-material/Sort";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { Contestant } from "../../Models/Contestant";
import { PointsPerPosition } from "../../Models/PointsPerPosition";
import { Round } from "../../Models/Round";
import { useContext, useRef, ChangeEvent } from "react";
import { RaceDataContext } from "./Leaderboard";
import PointsDialog from "./PointsDialog";
import AddRound from "./AddRoundDialog";

function HeaderButtons() {
    const contextData = useContext(RaceDataContext);
    const [contestants, setContestants] = contextData!.contestants;
    const [rounds, setRounds] = contextData!.rounds;
    const [pointsPerPosition, setPointsPerPosition] =
        contextData!.pointsPerPosition;
    const [championshipTitle, setChampionshipTitle] =
        contextData!.championshipTitle;
    const [championshipDates, setChampionshipDates] =
        contextData!.championshipDates;
    const addContestant = () => {
        const newContestant: Contestant = {
            id: crypto.randomUUID(),
            name: "",
            points: 0,
            roundData: []
        };
        setContestants([...contestants, newContestant]);
    };

    const sortParticipants = () => {
        const unsortedContestants = [...contestants];
        const sortedContestants = unsortedContestants.sort((a, b) =>
            a.points > b.points ? -1 : 1
        );
        setContestants(sortedContestants);
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const csvEscape = (value: string | number) => {
        const stringValue = String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
    };

    const downloadFile = (
        content: string,
        filename: string,
        mimeType: string
    ) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const buildJsonPayload = () => ({
        contestants,
        rounds,
        pointsPerPosition,
        championshipTitle,
        championshipDates
    });

    const exportJson = () => {
        const payload = buildJsonPayload();
        downloadFile(
            JSON.stringify(payload, null, 2),
            "leaderboard-export.json",
            "application/json"
        );
    };

    const buildCsvPayload = () => {
        const metadataRow = ["__EXPORT_VERSION__", "1"].join(",");
        const titleRow = [
            "__CHAMPIONSHIP_TITLE__",
            csvEscape(championshipTitle)
        ].join(",");
        const datesRow = [
            "__CHAMPIONSHIP_DATES__",
            csvEscape(championshipDates)
        ].join(",");
        const pointsData = pointsPerPosition
            .map((p) => `${p.position}:${p.points}`)
            .join(";");
        const pointsHeader = [
            "__POINTS_PER_POSITION__",
            csvEscape(pointsData)
        ].join(",");
        const roundHeaders = rounds.map(
            (round) => `Round:${round.id}:${round.name}`
        );
        const headerRow = ["id", "name", "points", ...roundHeaders].join(",");
        const dataRows = contestants.map((contestant) => {
            const positions = rounds.map((round) => {
                const roundEntry = contestant.roundData.find(
                    (r) => r.roundId === round.id
                );
                return roundEntry ? roundEntry.position : 0;
            });
            return [
                csvEscape(contestant.id),
                csvEscape(contestant.name),
                csvEscape(contestant.points),
                ...positions.map(String)
            ].join(",");
        });
        return [
            metadataRow,
            titleRow,
            datesRow,
            pointsHeader,
            headerRow,
            ...dataRows
        ].join("\n");
    };

    const exportCsv = () => {
        downloadFile(
            buildCsvPayload(),
            "leaderboard-export.csv",
            "text/csv;charset=utf-8;"
        );
    };

    const parseCsv = (csv: string) => {
        const rows: string[][] = [];
        let current = "";
        let row: string[] = [];
        let inQuotes = false;
        for (let i = 0; i < csv.length; i++) {
            const char = csv[i];
            if (char === '"') {
                if (inQuotes && csv[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === "," && !inQuotes) {
                row.push(current);
                current = "";
            } else if ((char === "\n" || char === "\r") && !inQuotes) {
                if (char === "\r" && csv[i + 1] === "\n") {
                    i++;
                }
                row.push(current);
                rows.push(row);
                row = [];
                current = "";
            } else {
                current += char;
            }
        }
        if (current !== "" || row.length > 0) {
            row.push(current);
            rows.push(row);
        }
        return rows.filter(
            (row) => row.length > 0 && row.some((cell) => cell !== "")
        );
    };

    const normalizeContestants = (
        importedContestants: Contestant[],
        importedRounds: Round[],
        importedPoints: PointsPerPosition[]
    ) => {
        return importedContestants.map((contestant) => {
            const normalizedRoundData = importedRounds.map((round) => {
                const roundEntry = contestant.roundData.find(
                    (entry) => entry.roundId === round.id
                );
                return roundEntry ?? { roundId: round.id, position: 0 };
            });
            const points = normalizedRoundData.reduce((sum, roundData) => {
                const positionPoints =
                    importedPoints.find(
                        (p) => p.position === roundData.position
                    )?.points ?? 0;
                return sum + positionPoints;
            }, 0);
            return {
                ...contestant,
                roundData: normalizedRoundData,
                points
            };
        });
    };

    const parseCsvFile = (text: string) => {
        const rows = parseCsv(text);
        if (rows.length < 2) {
            throw new Error("CSV file is not in the expected format.");
        }
        const versionRow = rows[0];
        let importedChampionTitle = championshipTitle;
        let importedChampionDates = championshipDates;
        let filePointsPerPosition: PointsPerPosition[] = pointsPerPosition;
        let headerStart = 0;
        if (versionRow[0] === "__EXPORT_VERSION__") {
            let currentLine = 1;
            let pointsParsed = false;
            while (
                rows[currentLine] &&
                rows[currentLine][0]?.startsWith("__")
            ) {
                const rowType = rows[currentLine][0];
                if (rowType === "__POINTS_PER_POSITION__") {
                    const pointsData = rows[currentLine][1] ?? "";
                    filePointsPerPosition = pointsData
                        .split(";")
                        .filter(Boolean)
                        .map((row) => {
                            const [position, points] = row.split(":");
                            return {
                                position: Number(position),
                                points: Number(points)
                            };
                        });
                    pointsParsed = true;
                } else if (rowType === "__CHAMPIONSHIP_TITLE__") {
                    importedChampionTitle =
                        rows[currentLine][1] ?? importedChampionTitle;
                } else if (rowType === "__CHAMPIONSHIP_DATES__") {
                    importedChampionDates =
                        rows[currentLine][1] ?? importedChampionDates;
                } else {
                    break;
                }
                currentLine += 1;
            }
            if (!pointsParsed) {
                throw new Error(
                    "CSV metadata is missing points position data."
                );
            }
            headerStart = currentLine;
        }
        const header = rows[headerStart];
        const roundHeaders = header.slice(3);
        const importedRoundsData: Round[] = roundHeaders.map((cell, index) => {
            if (cell.startsWith("Round:")) {
                const [, id, ...nameSections] = cell.split(":");
                return { id, name: nameSections.join(":") };
            }
            return { id: `round-${index}`, name: cell };
        });
        const importedContestants = rows.slice(headerStart + 1).map((row) => {
            const id = row[0];
            const name = row[1];
            const positions = row.slice(3).map((value) => Number(value) || 0);
            const roundData = importedRoundsData.map((round, index) => ({
                roundId: round.id,
                position: positions[index]
            }));
            return {
                id,
                name,
                points: 0,
                roundData
            };
        });
        return {
            contestants: importedContestants,
            rounds: importedRoundsData,
            pointsPerPosition: filePointsPerPosition,
            championshipTitle: importedChampionTitle,
            championshipDates: importedChampionDates
        };
    };

    const processImportedData = (data: unknown) => {
        const imported = data as {
            contestants: Contestant[];
            rounds: Round[];
            pointsPerPosition: PointsPerPosition[];
        };
        if (
            !Array.isArray(imported.contestants) ||
            !Array.isArray(imported.rounds) ||
            !Array.isArray(imported.pointsPerPosition)
        ) {
            throw new Error(
                "Imported JSON must contain contestants, rounds, and pointsPerPosition arrays."
            );
        }
        const normalizedContestants = normalizeContestants(
            imported.contestants,
            imported.rounds,
            imported.pointsPerPosition
        );
        setRounds(imported.rounds);
        setPointsPerPosition(imported.pointsPerPosition);
        setContestants(normalizedContestants);
    };

    const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.currentTarget;
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            try {
                if (file.name.toLowerCase().endsWith(".csv")) {
                    const parsed = parseCsvFile(text);
                    const normalizedContestants = normalizeContestants(
                        parsed.contestants,
                        parsed.rounds,
                        parsed.pointsPerPosition
                    );
                    setRounds(parsed.rounds);
                    setPointsPerPosition(parsed.pointsPerPosition);
                    setContestants(normalizedContestants);
                    setChampionshipTitle(
                        parsed.championshipTitle ?? championshipTitle
                    );
                    setChampionshipDates(
                        parsed.championshipDates ?? championshipDates
                    );
                    alert("Leaderboard imported from CSV successfully.");
                } else {
                    const parsed = JSON.parse(text);
                    processImportedData(parsed);
                    setChampionshipTitle(
                        parsed.championshipTitle ??
                            parsed.title ??
                            championshipTitle
                    );
                    setChampionshipDates(
                        parsed.championshipDates ??
                            parsed.dates ??
                            championshipDates
                    );
                    alert("Leaderboard imported from JSON successfully.");
                }
            } catch (error) {
                alert(
                    `Failed to import file: ${
                        error instanceof Error ? error.message : "Invalid data."
                    }`
                );
            } finally {
                fileInput.value = "";
            }
        };
        reader.readAsText(file);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            style={{
                marginTop: "5px",
                marginBottom: "5px",
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "8px"
            }}
        >
            <Button
                color="info"
                variant="contained"
                onClick={addContestant}
                startIcon={<PersonAddIcon />}
            >
                Add Participant
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={exportJson}
                startIcon={<DownloadIcon />}
            >
                Export JSON
            </Button>
            <Button
                color="primary"
                variant="outlined"
                onClick={exportCsv}
                startIcon={<DownloadIcon />}
            >
                Export CSV
            </Button>
            <Button
                color="success"
                variant="contained"
                onClick={openFilePicker}
                startIcon={<UploadFileIcon />}
            >
                Import File
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                style={{ display: "none" }}
                onChange={handleFileSelection}
            />
            <AddRound />
            <Button
                color="secondary"
                variant="contained"
                onClick={sortParticipants}
                startIcon={<SortIcon />}
            >
                Sort Participants
            </Button>
            <PointsDialog />
        </div>
    );
}
export default HeaderButtons;
