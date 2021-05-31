import readline from 'readline'
import { Challenge } from './omen'

function inputSessionID():Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve)=>{
        rl.question('请输入SessionID: ', (answer:string) => {   
            rl.close(); 
            resolve(answer);
        })
    });   
}


(async function(){
    let sessionId:string;
    if(process.argv.length>2){
        sessionId = process.argv[2]
    }else{
        sessionId = await inputSessionID()
    }

    let challenge:Challenge = new Challenge(sessionId);
    console.log('获取可参与挑战列表...')
    let allList = await challenge.getAllList()
    console.log(`可加入的挑战数: ${allList.length}`)
    for (const cha of allList) {
        await challenge.join(cha.campaignId, cha.challengeStructureId);
        console.log(`加入挑战 ${cha.relevantEvents}`)
    }

    let currentList = await challenge.getCurrentList();
    console.log(`待完成任务数: ${currentList.length}`);
    for (const cha of currentList) {
        challenge.doTask(cha.relevantEvents);
    }
    console.log('任务完成')
})();
