import axios from "axios";
import {
    AllListBody, JoinBody, CurrentListBody, TaskBody,
} from "./PostBody";

const apiUrl = "https://rpc-prod.versussystems.com/rpc";

class Challenge {
    public sessionId:string;

    constructor(sessionId:string) {
        this.sessionId = sessionId;
    }

    static getResultList(res:any) {
        const { collection } = res.data.result;
        const resultList = [];
        for (const activity of collection) {
            if (activity.prize.category === "sweepstake") {
                const result = {
                    campaignId: activity.prize.campaignId,
                    challengeStructureId: activity.challengeStructureId,
                    relevantEvents: activity.relevantEvents[0],
                };
                resultList.push(result);
            }
        }
        return resultList;
    }

    /**
     * getAllList
     */
    public getAllList():Promise<any> {
        const allListPost:AllListBody = new AllListBody(this.sessionId);
        return axios.post(apiUrl, allListPost).then((res) => Challenge.getResultList(res))
    }

    /**
     * join
     */
    public join(campaignId:string, challengeStructureId:string):Promise<any> {
        const joinPost:JoinBody = new JoinBody(this.sessionId, campaignId, challengeStructureId);
        return axios.post(apiUrl, joinPost)
    }

    /**
     * getCurrentList
     */
    public getCurrentList():Promise<any> {
        const currentListPost:CurrentListBody = new CurrentListBody(this.sessionId);
        return axios.post(apiUrl, currentListPost).then((res) => Challenge.getResultList(res))
    }

    /**
     * doTask
     */
    public doTask(eventName:string, time:number, index:number):Promise<string> {
        const taskPost:TaskBody = new TaskBody(this.sessionId, eventName, time);
        console.log("\x1b[32m%s\x1b[0m%s", `账号${index}：`, `开始执行 ${eventName}`);
        return axios.post(apiUrl, taskPost).then((res) => res.data.result[0].state)
    }
}

export default Challenge;
