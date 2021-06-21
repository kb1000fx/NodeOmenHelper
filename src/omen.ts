import Challenge from "./lib/Challenge";
import Login from "./lib/Login";

export async function doTaskViaSession(sessionId:string, time:number = 45, index:number = 1):Promise<boolean> {
    const challenge = new Challenge(sessionId);
    console.log("\x1b[32m%s\x1b[0m%s", `账号${index}：`, "获取可参与挑战列表...");

    const allList = await challenge.getAllList();
    console.log("\x1b[32m%s\x1b[0m%s", `账号${index}：`, `可加入的挑战数: ${allList.length}`);

    for (const cha of allList) {
        await challenge.join(cha.campaignId, cha.challengeStructureId);
        console.log("\x1b[32m%s\x1b[0m%s", `账号${index}：`, `加入挑战 ${cha.relevantEvents}`);
    }

    const currentList = await challenge.getCurrentList();
    console.log("\x1b[32m%s\x1b[0m%s", `账号${index}：`, `待完成任务数: ${currentList.length}`);

    let flag:boolean = true;
    for (const cha of currentList) {
        const state = await challenge.doTask(cha.relevantEvents, time, index);
        if (state === "running") {
            flag = false;
        }
    }

    return flag;
}

export async function doTaskViaAccount(email:string, pwd:string, time:number = 45, index:number = 1):Promise<boolean> {
    const login = new Login(email, pwd);
    await login.webPrepare();
    const localhostUrl = await login.webLogin();
    const accessToken = await login.clientLogin(localhostUrl);
    const session = await login.genSession(accessToken);
    return doTaskViaSession(session, time, index);
}

export async function doTaskViaFile(config:Record<string, any>) {
    let flag:boolean = true;
    for (let index = 0; index < config.accounts.length; index += 1) {
        const account = config.accounts[index];
        console.log("\x1b[32m%s\x1b[0m", `账号${index + 1}：开始`);
        const state = await doTaskViaAccount(account.email, account.password, config.defaultPlayTime, index + 1);
        if (!state) {
            flag = state;
        }
        console.log("\x1b[32m%s\x1b[0m", `账号${index + 1}：完毕`);
    }
    return flag;
}
