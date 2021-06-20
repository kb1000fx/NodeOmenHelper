import util from "./Util";
import axios from "axios";
import { HandshakeBody, StartBody } from "./PostBody"

const url = 'https://oauth.hpbp.io/oauth/v1/auth';
const backendUrl = "https://ui-backend.id.hp.com/bff/v1/auth/session";
const sessionUrl1 = 'https://www.hpgamestream.com/api/thirdParty/session/temporaryToken?applicationId=6589915c-6aa7-4f1b-9ef5-32fa2220c844';

class Login {
    public email:string = "";
    
    public pwd:string = "";

    public backendCsrf:string = "";

    public cookie:string = "";

    public loginAddr:string = "";

    public state:string = '6W-6YnRulaSczbZa_gxbAxd-XEJdOWn9jV86Ow493IM'//'G5g495-R4cEE'+ (Math.random()*100000);

    private readonly applicationId:string = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";

    private readonly clientId:string = "130d43f1-bb22-4a9c-ba48-d5743e84d113";

    constructor(email = "", pwd = "") {
        this.email = email;
        this.pwd = pwd;
    }

    /**
     * init
     */
    public async init() {
        this.email = await util.inputVal("邮箱");
        this.pwd = await util.inputVal("密码");
    }

    /**
     * webPrepare
     */
    public async webPrepare() {
        const flow:string = await axios.get(url,{    
            params: {
                'response_type': 'code',
                'client_id': '130d43f1-bb22-4a9c-ba48-d5743e84d113', 
                'redirect_uri': 'http://localhost:9080/login', 
                'scope': 'email profile offline_access openid user.profile.write user.profile.username user.profile.read', 
                'state': this.state,
                'max_age': '28800', 
                'acr_values': 'urn:hpbp:hpid', 
                'prompt': 'consent'
            }       
        }).then(res=>{
            return res.request.path.split('=')[1]
        }).catch(e=>{
            console.log(e.response.data)  
        });
        const res = await axios.post(backendUrl, {flow:flow});
        const cookieSet = res.headers['set-cookie'][0];
        this.cookie = cookieSet.split(';')[0];
        this.backendCsrf = res.data.csrfToken;
        this.loginAddr = res.data.regionEndpointUrl;
    }

    /**
     * webLogin
     */
    public async webLogin():Promise<string> {
        const nextUrl:string = await axios.request({
            url: '/session/username-password',    
            baseURL: this.loginAddr, 
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "CSRF-TOKEN": this.backendCsrf,
                "Cookie": this.cookie
            },
            data: {
                username: this.email + '@hpid',
                password: this.pwd
            },         
        }).then((res)=>{
            return res.data.nextUrl
        }).catch((e)=>{
            console.log(e.response.data)   
        });

        const localhostUrl = await axios.get(nextUrl, {
            maxRedirects: 0,
            validateStatus: (status)=>true,
        }).then(res=>{
            return res.headers.location
        });

        return localhostUrl
    }

    /**
     * clientLogin
     */
    public async clientLogin(localhostUrl:string):Promise<string> {     
        const urlQuery:URL = new URL(localhostUrl);
        const code:string|null = urlQuery.searchParams.get('code');

        const accessToken = await axios.request({
            url: "https://oauth.hpbp.io/oauth/v1/token",    
            method: 'POST',
            data: 'grant_type=authorization_code&code='+code+'&client_id=130d43f1-bb22-4a9c-ba48-d5743e84d113&redirect_uri=http://localhost:9080/login',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },

        }).then(res=>{
            return res.data.access_token
        });

        return accessToken    
    }

    /**
     * genSession
     */
    public async genSession(authorization:string):Promise<string> {
        const tmpToken:string = await axios.get(sessionUrl1, {
            headers: {
                Authorization: "Bearer " + authorization
            }
        }).then(res=>{
            return res.data.token
        });

        const handshakeBody:HandshakeBody = new HandshakeBody(tmpToken);
        const { accountToken, externalPlayerId } = await axios.post("https://rpc-prod.versussystems.com/rpc",handshakeBody).then(res=>{
            return { 
                accountToken: res.data.result.token, 
                externalPlayerId: res.data.result.players[0].externalPlayerId
            }
        });

        const startBody:StartBody = new StartBody(accountToken, externalPlayerId);
        const sessionToken:string = await axios.post("https://rpc-prod.versussystems.com/rpc",startBody).then(res=>{
            return res.data.result.sessionId
        });

        return sessionToken
    }
}

export default Login;
