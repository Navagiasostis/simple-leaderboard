import { PointsPerPosition } from "../../../Models/PointsPerPosition";
import { Round } from "../../../Models/Round";

export const initialRounds: Round[] = [
    { id: "0", name: "Spa" },
    { id: "1", name: "Monza" },
    { id: "2", name: "Nordschleife" },
    { id: "3", name: "Mugello" },
    { id: "4", name: "RedBull Ring" }
];

export const initialPointsPerPosition: PointsPerPosition[] = [
    { position: 1, points: 15 },
    { position: 2, points: 12 },
    { position: 3, points: 9 },
    { position: 4, points: 6 },
    { position: 5, points: 3 }
];
