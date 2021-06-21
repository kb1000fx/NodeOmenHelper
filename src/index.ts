import Util from "./lib/Util";
import { doTaskViaSession, doTaskViaAccount, doTaskViaFile } from "./omen";

async function main() {
    const config = Util.readConfig();

    if (process.argv.length > 2) {
        await doTaskViaSession(process.argv[2]);
    } else if (config) {
        console.log("\x1b[36m%s\x1b[0m", `共${config.accounts.length}个账号`);
        const flag:boolean = await doTaskViaFile(config);

        if (!flag) {
            console.log("\x1b[36m%s\x1b[0m", "未完成");
            await Util.sleep(45.02);
            await doTaskViaFile(config);
        }

        console.log("\x1b[36m%s\x1b[0m", "所有账号完毕");
    } else {
        const email:string = await Util.inputVal("E-Mail");
        const pwd:string = await Util.inputVal("密码");
        await doTaskViaAccount(email, pwd);
    }
}

main();
