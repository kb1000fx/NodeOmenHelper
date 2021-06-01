import util from './util'
import { Challenge } from './omen'


(async function(){
    let sessionId:string;
    let sessionFlag:boolean =true;

    let challenge:Challenge = new Challenge('');
    let allList:Array<any> = new Array();

    if(process.argv.length>2){
        sessionId = process.argv[2]
    }else{
        sessionId = await util.inputSessionID()
    }

    while (sessionFlag) {
        try {
            sessionFlag = false;
            challenge = new Challenge(sessionId);
            console.log('获取可参与挑战列表...');
            allList = await challenge.getAllList();  
        } catch (error) {
            sessionFlag = true;
            console.log(`Session过期或无效，请重新输入`)
            sessionId = await util.inputSessionID()
        }     
    }
    
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
