import schedule from "node-schedule";
import Util from "./lib/Util";
import { doTaskViaSession, doTaskViaAccount, doTaskViaFile } from "./omen";

async function doAutoTask(config:Record<string, any>):Promise<void> {
    console.log("\x1b[36m%s\x1b[0m", `共${config.accounts.length}个账号，开始执行第一轮`);
    const flagOne:boolean = await doTaskViaFile(config);

    if (!flagOne) {
        console.log("\x1b[36m%s\x1b[0m", `第一轮执行完成，${config.defaultPlayTime}分钟后执行第二轮`);
        await Util.sleep(config.defaultPlayTime);
        const flagTwo:boolean = await doTaskViaFile(config);
        if (!flagTwo) {
            console.log("\x1b[31m%s\x1b[0m", "执行失败，请重新设置执行时长");
        } else {
            console.log("\x1b[32m%s\x1b[0m", "所有账号完毕");
        }
    } else {
        console.log("\x1b[32m%s\x1b[0m", "所有账号完毕");
    }
}

async function main() {
    const config = Util.readConfig();

    if (process.argv.length > 2) {
        await doTaskViaSession(process.argv[2]);
    } else if (config) {
        if (config.schedule) {
            console.log("\x1b[35m%s\x1b[0m", `Schedule: ${config.schedule}`);
            schedule.scheduleJob(config.schedule, async () => {
                console.log("\x1b[35m%s\x1b[0m", Date());
                await doAutoTask(config);
            });
        } else {
            await doAutoTask(config);
        }
    } else {
        const email:string = await Util.inputVal("E-Mail");
        const pwd:string = await Util.inputVal("密码");
        await doTaskViaAccount(email, pwd);
    }
}

main();
