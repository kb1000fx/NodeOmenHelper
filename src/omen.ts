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
        return axios.post(apiUrl, allListPost).then(
            (res) => Challenge.getResultList(res),
        ).catch((error) => {
            throw error.response.data.error;
        });
    }

    /**
     * join
     */
    public join(campaignId:string, challengeStructureId:string):Promise<any> {
        const joinPost:JoinBody = new JoinBody(this.sessionId, campaignId, challengeStructureId);
        return axios.post(apiUrl, joinPost).catch((error) => {
            throw error.response.data.error;
        });
    }

    /**
     * getCurrentList
     */
    public getCurrentList():Promise<any> {
        const currentListPost:CurrentListBody = new CurrentListBody(this.sessionId);
        return axios.post(apiUrl, currentListPost).then(
            (res) => Challenge.getResultList(res),
        ).catch((error) => {
            throw error.response.data.error;
        });
    }

    /**
     * doTask
     */
    public doTask(eventName:string) {
        const taskPost:TaskBody = new TaskBody(this.sessionId, eventName);
        console.log(`开始执行 ${eventName}`);
        return axios.post(apiUrl, taskPost).catch((error) => {
            throw error.response.data.error;
        });
    }
}

export default Challenge;
