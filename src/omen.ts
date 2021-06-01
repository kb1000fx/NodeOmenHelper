import axios from 'axios'
import { AllListBody, JoinBody, CurrentListBody, TaskBody } from './PostBody'
const apiUrl:string = 'https://rpc-prod.versussystems.com/rpc';


export class Challenge {
    public sessionId:string;

    constructor(sessionId:string) {
        this.sessionId = sessionId;
    }

    private getResultList(res:any) {
        let collection = res.data.result.collection;
        let resultList = [];
        for (const activity of collection) {
            if(activity.prize.category == 'sweepstake'){
                let result = {
                    campaignId: activity.prize.campaignId,
                    challengeStructureId: activity.challengeStructureId,
                    relevantEvents: activity.relevantEvents[0]
                };
                resultList.push(result);     
            }        
        };
        return resultList 
    }

    /**
     * getAllList
     */
    public getAllList():Promise<any> {
        let allListPost:AllListBody = new AllListBody(this.sessionId);
        return axios.post(apiUrl, allListPost).then(
            (res)=>{
                return this.getResultList(res)
            }
        ).catch((error)=>{
            throw error.response.data.error;        
        });  
    }

    /**
     * join
     */
    public join(campaignId:string, challengeStructureId:string):Promise<any> {
        let joinPost:JoinBody = new JoinBody(this.sessionId, campaignId, challengeStructureId);
        return axios.post(apiUrl, joinPost).catch((error)=>{
            throw error.response.data.error;
        });  
    }

    /**
     * getCurrentList
     */
    public getCurrentList():Promise<any> {
        let currentListPost:CurrentListBody = new CurrentListBody(this.sessionId);
        return axios.post(apiUrl, currentListPost).then(
            (res)=>{
                return this.getResultList(res)
            }
        ).catch((error)=>{
            throw error.response.data.error;
        });  
    }

    /**
     * doTask
     */
    public doTask(eventName:string) {
        let taskPost:TaskBody = new TaskBody(this.sessionId, eventName);
        console.log(`开始执行 ${eventName}`);
        return axios.post(apiUrl, taskPost).catch((error)=>{
            throw error.response.data.error;
        });  
    }
};
