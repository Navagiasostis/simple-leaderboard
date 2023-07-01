import {
    useState,
    useMemo,
    createContext,
    Dispatch,
    SetStateAction
} from "react";
import { Contestant } from "../../Models/Contestant";
import { PointsPerPosition } from "../../Models/PointsPerPosition";
import { Round } from "../../Models/Round";
import HeaderButtons from "./HeaderButtons";
import { initialRounds, initialPointsPerPosition } from "./TestData/Data";
import { LeaderboardTable } from "./Table";

type LeaderboardProps = {
    contestants: [
        contestants: Contestant[],
        setContestants: Dispatch<SetStateAction<Contestant[]>>
    ];
    rounds: [rounds: Round[], setRounds: Dispatch<SetStateAction<Round[]>>];
    pointsPerPosition: [
        pointsPerPosition: PointsPerPosition[],
        setPointsPerPosition: Dispatch<SetStateAction<PointsPerPosition[]>>
    ];
};

export const RaceDataContext = createContext<LeaderboardProps | null>(null);

export const Leaderboard = () => {
    const [rounds, setRounds] = useState<Round[]>(initialRounds);
    const [pointsPerPosition, setPointsPerPosition] = useState<
        PointsPerPosition[]
    >(initialPointsPerPosition);
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const RaceData = useMemo(() => {
        return {
            rounds: [rounds, setRounds],
            pointsPerPosition: [pointsPerPosition, setPointsPerPosition],
            contestants: [contestants, setContestants]
        } as LeaderboardProps;
    }, [rounds, pointsPerPosition, contestants]);
    return (
        <>
            <RaceDataContext.Provider value={RaceData}>
                <HeaderButtons />
                <LeaderboardTable />
            </RaceDataContext.Provider>
        </>
    );
};
