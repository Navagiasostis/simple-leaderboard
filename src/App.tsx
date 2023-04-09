import { useState } from 'react';
import './App.css';
import ResponsiveAppBar from './leaderboard/Components/AppBar';
import { LeaderboardTable } from './leaderboard/Components/Table';
import { Contestant } from './leaderboard/Models/Contestant';

function App() {

  const [contestants, setContestants] = useState<Contestant[]>([]);
  
  console.table(contestants)
  return (
    <>
      <header>
        <ResponsiveAppBar/>
      </header>
      <body>
        <LeaderboardTable contestants={contestants} setContestants={setContestants}/>
      </body>
    </>
    
  );
}

export default App;