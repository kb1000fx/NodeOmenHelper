import crypto from "crypto";
import readline from "readline";

function UUIDtoByteArray(uuid:string):Uint8Array {
    const text = uuid.replace(/-/g, "");
    const num = text.length / 2;
    const array = new Uint8Array(num);
    for (let i = 0; i < num; i += 1) {
        const substring = text.substring(i * 2, i * 2 + 2);
        if (substring.length === 0) {
            array[i] = 0;
        } else {
            array[i] = parseInt(substring, 16);
        }
    }
    return array;
}

function sign(text:Uint8Array, array:Uint8Array):string {
    const secret = crypto.createSecretKey(array);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(text);
    const res = hmac.digest("base64");
    return res;
}

function inputVal(str:string):Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(`请输入${str}: `, (answer:string) => {
            rl.close();
            resolve(answer);
        });
    });
}

export default {
    UUIDtoByteArray,
    sign,
    inputVal,
};
