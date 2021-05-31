
const crypto = require('crypto');

function UUIDtoByteArray(uuid:string):Uint8Array{
    let text = uuid.replace(/-/g, "");
    let num = text.length / 2;
    let array = new Uint8Array(num);
    for (let i = 0; i < num; i++) {
        let substring = text.substring(i * 2, i * 2 + 2);
        if (substring.length == 0) {
            array[i] = 0;
        } else {
            array[i] = parseInt(substring, 16);
        }   
    }
    return array
}

function sign(text:Uint8Array, array:Uint8Array):string{
    const secret = crypto.createSecretKey(array);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(text);
    let res = hmac.digest('base64');
    return res
}

export default  {
    UUIDtoByteArray,
    sign,
}
