import  util from './util'
const applicationId = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";

interface Params {
    /*
    sessionToken:string,
    applicationId:string,
    page:number,
    pageSize:number,
    sdk:string,
    sdkVersion:string,
    appDefaultLanguage:string,
    userPreferredLanguage:string,
    */
    [propName: string]: any
}


class PostBody {
    public readonly jsonrpc:string = '2.0'; 
    public readonly id:string = applicationId;
    public method:string = '';
    public params:Params;

    constructor(sessionId:string){
        this.params = {
            sessionToken: sessionId,
            applicationId: applicationId,
            sdk: "custom01",
            sdkVersion: "3.0.0",
            appDefaultLanguage: "en",
            userPreferredLanguage: "zh-cn",
        }
    }
}


export class AllListBody extends PostBody {
    constructor(sessionId:string){
        super(sessionId);
        this.method = 'mobile.challenges.v4.list';
        this.params.onlyShowEligibleChallenges = true;
        this.params.page = 1;
        this.params.pageSize = 100;
    }
}

export class JoinBody extends PostBody {
    constructor(sessionId:string, campaignId:string, challengeStructureId:string){
        super(sessionId);
        this.method = 'mobile.challenges.v2.join';
        this.params.timezone = "China Standard Time";
        this.params.campaignId = campaignId;
        this.params.challengeStructureId = challengeStructureId;
    }
}

export class CurrentListBody extends PostBody {
    constructor(sessionId:string){
        super(sessionId);
        this.method = 'mobile.challenges.v2.current';
        this.params.page = 1;
        this.params.pageSize = 100;
    }
}

export class TaskBody extends PostBody {
    constructor(sessionId:string, eventName:string){
        super(sessionId);
        this.method = 'mobile.challenges.v2.progressEvent';
        this.params.value = 1;
        this.params.eventName = eventName;
        let startTime = new Date();
        startTime.setMinutes(-45);
        this.params.startedAt = startTime.toISOString();
        this.params.endedAt = new Date().toISOString();
        this.params.signature = this.getSignature(sessionId, eventName);
    }

    private getSignature(sessionId:string, eventName:string):string {
        let array:Uint8Array = util.UUIDtoByteArray(applicationId);
        let array2:Uint8Array = util.UUIDtoByteArray(sessionId);
        let array3:Uint8Array = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            if (i<8) {
                array3[i] = array[i * 2 + 1];
            } else {
                array3[i] = array2[(i - 8) * 2];
            }      
        }
        let text:Uint8Array = this.getSignableText();
        let res  = util.sign(text, array3);
        return res
    }

    private getSignableText():Uint8Array {
        let text:string = this.params.eventName + this.params.startedAt + this.params.endedAt + this.params.value;
        let buf = Buffer.from(text, 'utf8');
        let array = new Uint8Array(buf.length);
        for (let index = 0; index < buf.length; index++) {
            array[index] = buf[index];  
        }
        return array
    }
}