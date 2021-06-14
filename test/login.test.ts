import Login from "../src/login";

describe('Test Login', () => {
    const login = new Login('usr','pwd'); 
    
    test('Get csrfToken & Cookie', async () => {
        await login.webPrepare();
        console.log(`cookie: ${login.cookie}`)
        expect(login.backendCsrf).toMatch(/[-\w]{36}/);    
        expect(login.cookie).not.toBeUndefined;  
    }, 100000);

    test('Mock Web Login', async () => {
        const localhostUrl = await login.webLogin();
        console.log(`localhostUrl: ${localhostUrl}`);  
        expect(localhostUrl).not.toBeUndefined();
    }, 100000);

});
