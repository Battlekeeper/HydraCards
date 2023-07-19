import { TSMap } from "typescript-map"
export default class HistoricalVote {
	TopicName:string = ""
	Revotes: Array<TSMap<string,number>> = new Array<TSMap<string, number>>
}