import Util from "./Util";

const applicationId = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";

class BaseBody {
    public readonly jsonrpc:string = "2.0";

    public readonly id:string = applicationId;

    public method:string = "";

    public params:Record<string, any>;

    constructor() {
        this.params = {
            applicationId,
            sdk: "custom01",
            sdkVersion: "3.0.0",
            appDefaultLanguage: "en",
            userPreferredLanguage: "zh-cn",
        };
    }
}

class PostBody extends BaseBody {
    constructor(sessionId:string) {
        super();
        this.params.sessionToken = sessionId;
    }
}

export class AllListBody extends PostBody {
    constructor(sessionId:string) {
        super(sessionId);
        this.method = "mobile.challenges.v4.list";
        this.params.onlyShowEligibleChallenges = true;
        this.params.page = 1;
        this.params.pageSize = 100;
    }
}

export class JoinBody extends PostBody {
    constructor(sessionId:string, campaignId:string, challengeStructureId:string) {
        super(sessionId);
        this.method = "mobile.challenges.v2.join";
        this.params.timezone = "China Standard Time";
        this.params.campaignId = campaignId;
        this.params.challengeStructureId = challengeStructureId;
    }
}

export class CurrentListBody extends PostBody {
    constructor(sessionId:string) {
        super(sessionId);
        this.method = "mobile.challenges.v2.current";
        this.params.page = 1;
        this.params.pageSize = 100;
    }
}

export class TaskBody extends PostBody {
    constructor(sessionId:string, eventName:string, time:number) {
        super(sessionId);
        const { startedAt, endedAt } = Util.getTimes(time);
        this.method = "mobile.challenges.v2.progressEvent";
        this.params.value = 1;
        this.params.eventName = eventName;
        this.params.startedAt = startedAt;
        this.params.endedAt = endedAt;
        this.params.signature = this.getSignature();
    }

    private getSignature():string {
        const array:Uint8Array = Util.UUIDtoByteArray(this.params.applicationId);
        const array2:Uint8Array = Util.UUIDtoByteArray(this.params.sessionToken);
        const array3:Uint8Array = new Uint8Array(16);
        for (let i = 0; i < 16; i += 1) {
            if (i < 8) {
                array3[i] = array[i * 2 + 1];
            } else {
                array3[i] = array2[(i - 8) * 2];
            }
        }
        const text:Uint8Array = this.getSignableText();
        const res = Util.sign(text, array3);
        return res;
    }

    private getSignableText():Uint8Array {
        const text:string = this.params.eventName + this.params.startedAt
                            + this.params.endedAt + this.params.value;
        const buf = Buffer.from(text, "utf8");
        const array = new Uint8Array(buf.length);
        for (let index = 0; index < buf.length; index += 1) {
            array[index] = buf[index];
        }
        return array;
    }
}

export class HandshakeBody extends BaseBody {
    constructor(userToken:string) {
        super();
        this.method = "mobile.accounts.v1.handshake";
        this.params.userToken = userToken;
        this.params.birthdate =  "1991-12-25";
    }
}

export class StartBody extends BaseBody {
    constructor(accountToken:string, externalPlayerId:string) {
        super();
        this.method = "mobile.sessions.v2.start";
        this.params.accountToken = accountToken;
        this.params.externalPlayerId = externalPlayerId;
        this.params.location = {
            latitude: 30.5832367,
            longitude: 103.982384,
        };
    }
}
