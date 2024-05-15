import { TSMap } from "typescript-map"
export default class HistoricalVote {
	TopicName:string = ""
	Points:number = 0
	URL:string = ""
	Revotes: Array<TSMap<string,number>> = new Array<TSMap<string, number>>
}