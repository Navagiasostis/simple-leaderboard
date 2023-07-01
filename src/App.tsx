import "./App.css";
import ResponsiveAppBar from "./leaderboard/Components/AppBar";
import { Leaderboard } from "./leaderboard/Components/Leaderboard/Leaderboard";

function App() {
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
                <Leaderboard/>
            </body>
        </>
    );
}

export default App;
