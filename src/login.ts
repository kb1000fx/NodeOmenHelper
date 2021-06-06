import util from "./util";

class Login {
    public email = "";
    
    public pwd = "";

    private readonly applicationId:string = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";

    private readonly clientId:string = "130d43f1-bb22-4a9c-ba48-d5743e84d113";

    constructor(email = "", pwd = "") {
        this.email = email;
        this.pwd = pwd;
    }

    public async init() {
        this.email = await util.inputVal("邮箱");
        this.pwd = await util.inputVal("密码");
    }
}

export default Login;
