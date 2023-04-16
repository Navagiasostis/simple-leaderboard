import { useState } from 'react';
import './App.css';
import ResponsiveAppBar from './leaderboard/Components/AppBar';
import { LeaderboardTable } from './leaderboard/Components/Table';
import { Contestant } from './leaderboard/Models/Contestant';
import { PointsPerPosition } from './leaderboard/Models/PointsPerPosition';
import { Round } from './leaderboard/Models/Round';



const initialRounds: Round[] = [{id: "0", name: "Spa"},{id: "1", name: "Monza"}];

const initialPointsPerPosition: PointsPerPosition[] = [{position: 1, points: 15},{position: 2, points: 12},{position: 3, points: 9},{position: 4, points: 6},{position: 5, points: 3}];

const initialCons: Contestant[] = [
  { id: crypto.randomUUID(), name: "John Mattermost", points: 0, roundData:[{roundId: "0", position: 0},{roundId: "1", position: 0}] },
  { id: crypto.randomUUID(), name: "Jane Mattermost", points: 0, roundData:[{roundId: "0", position: 0},{roundId: "1", position: 0}] },
  { id: crypto.randomUUID(), name: "Bob Mattermost", points: 0, roundData:[{roundId: "0", position: 0},{roundId: "1", position: 0}] },
  { id: crypto.randomUUID(), name: "Alice Mattermost", points: 0, roundData:[{roundId: "0", position: 0},{roundId: "1", position: 0}] },
  { id: crypto.randomUUID(), name: "Mike Mattermost", points: 0, roundData:[{roundId: "0", position: 0},{roundId: "1", position: 0}] },
];

function App() {

  const [contestants, setContestants] = useState<Contestant[]>(initialCons);
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [pointsPerPosition, setPointsPerPosition] = useState<PointsPerPosition[]>(initialPointsPerPosition);
  return (
    <>
      <header>
        <ResponsiveAppBar/>
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