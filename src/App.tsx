import { useEffect, useState } from "react";
import "./App.css";
import ResponsiveAppBar from "./leaderboard/Components/AppBar";
import { LeaderboardTable } from "./leaderboard/Components/Table";
import { Contestant } from "./leaderboard/Models/Contestant";
import { PointsPerPosition } from "./leaderboard/Models/PointsPerPosition";
import { Round } from "./leaderboard/Models/Round";

const initialRounds: Round[] = [
  { id: "0", name: "Spa" },
  { id: "1", name: "Monza" },
  { id: "2", name: "Nordschleife" },
  { id: "3", name: "Mugello" },
  { id: "4", name: "RedBull Ring" },
];

const initialPointsPerPosition: PointsPerPosition[] = [
  { position: 1, points: 15 },
  { position: 2, points: 12 },
  { position: 3, points: 9 },
  { position: 4, points: 6 },
  { position: 5, points: 3 },
];

const initialCons: Contestant[] = [];

function App() {
  const [contestants, setContestants] = useState<Contestant[]>(initialCons);
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [pointsPerPosition, setPointsPerPosition] = useState<PointsPerPosition[]>(initialPointsPerPosition);

  //ISSUES: the update method on the ContestantRow doesnt work correctly. Check it out. Try to remove position 0/replace it with -

  // useEffect(() => {
  //   const numberOfAvailablePositions = contestants.length;
  //   const newPositions: PointsPerPosition[] = [];

  //   for (let i = 0; i <= numberOfAvailablePositions; i++) {
  //     if (pointsPerPosition.map((position) => position.position != i)) {
  //       const newPosition: PointsPerPosition = {
  //         position: i,
  //         points: 0,
  //       };
  //       setPointsPerPosition([...pointsPerPosition, newPosition]);
  //     }
  //   }
  // }, [contestants.length]);

  return (
    <>
      <header>
        <ResponsiveAppBar />
      </header>
      <body>
        <LeaderboardTable
          contestants={contestants}
          setContestants={setContestants}
          rounds={rounds}
          setRounds={setRounds}
          pointsPerPosition={pointsPerPosition}
          setPointsPerPosition={setPointsPerPosition}
        />
      </body>
    </>
  );
}

export default App;
