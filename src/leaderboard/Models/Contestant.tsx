import { RoundData } from "./RoundData"

export interface Contestant {

   id: string
   name: string
   points: number
   vehicle?: string
   roundData: RoundData[]
   
}