import { useState } from 'react';
import './App.css';
import ResponsiveAppBar from './leaderboard/Components/AppBar';
import { LeaderboardTable } from './leaderboard/Components/Table';
import { Contestant } from './leaderboard/Models/Contestant';

const initialCons: Contestant[] = [
  { id: "1", name: "John Mattermost", points: 100 },
  { id: "2", name: "Jane Mattermost", points: 90 },
  { id: "3", name: "Bob Mattermost", points: 80 },
  { id: "4", name: "Alice Mattermost", points: 70 },
  { id: "5", name: "Mike Mattermost", points: 60 },
];

const initialRounds: number[] = [1,2,3,4,5];

function App() {

  const [contestants, setContestants] = useState<Contestant[]>(initialCons);
  const [rounds, setRounds] = useState<number[]>(initialRounds);
  
  console.table(contestants)
  return (
    <>
      <header>
        <ResponsiveAppBar/>
      </header>
      <body>
        <LeaderboardTable contestants={contestants} setContestants={setContestants} rounds={rounds} setRounds={setRounds}/>
      </body>
    </>
    
  );
}

export default App;