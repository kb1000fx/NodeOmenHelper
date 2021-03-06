import Login from "../src/lib/Login";
import fs from 'fs';

describe('Test Login', () => {  
    const config = JSON.parse(fs.readFileSync('config.json', "utf8"));
    const login = new Login(config.accounts[0].email, config.accounts[0].password); 

    let localhostUrl:string = "";
    let accessToken:string = "";
    
    test('Get csrfToken & Cookie', async () => {
        await login.webPrepare();
        expect(login.backendCsrf).toMatch(/[-\w]{36}/);    
        expect(login.cookie).not.toBeUndefined;  
    }, 100000);

    test('Mock Web Login', async () => {
        localhostUrl = await login.webLogin();
        expect(localhostUrl).not.toBeUndefined();
    }, 100000);
    
    test('Mock Client Login', async () => {
        accessToken = await login.clientLogin(localhostUrl);
        expect(accessToken).not.toBeUndefined();
    }, 100000);

    test('Generate Session', async () => {
        const session = await login.genSession(accessToken);
        console.log(session);
        expect(session).not.toBeUndefined();
    }, 100000);
    
});
