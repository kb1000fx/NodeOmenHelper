import util from "./util";
import axios from "axios";
var HttpsProxyAgent = require('https-proxy-agent');

const url = 'https://oauth.hpbp.io/oauth/v1/auth';
const backendUrl = "https://ui-backend.id.hp.com/bff/v1/auth/session";


class Login {
    public email:string = "";
    
    public pwd:string = "";

    public backendCsrf:string = "";

    public cookie:string = "";

    public state:string = 'G5g495-R4cEE'+ (Math.random()*100000);

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
                'state': this.state,//'v0PLVJ_KeVo0n_j25Tqsv0sJM5NtPu8NvCsBcwR7Nt4'
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
        this.backendCsrf = res.data.csrfToken
    }

    /**
     * webLogin
     */
    public async webLogin():Promise<string> {
        const loginAddr = "https://ui-backend.us-west-2.id.hp.com/bff/v1/session/username-password";
        const httpProxyAgent = new HttpsProxyAgent('http://127.0.0.1:1080');

        const nextUrl:string = await axios.request({
            url: loginAddr,     
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
            //httpsAgent: httpProxyAgent     
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
    public clientLogin(localhostUrl:string) {

        
    }

    /**
     * genSession
     */
    public genSession(authorization:string) {
        
    }
}

export default Login;
