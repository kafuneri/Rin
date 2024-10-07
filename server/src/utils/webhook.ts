import * as crypto from 'crypto';

/**
 * 生成加签签名
 * @param secret 钉钉机器人的加签密钥
 * @returns {timestamp: number, sign: string} 时间戳和签名
 */
function generateSignature(secret: string): { timestamp: number; sign: string } {
    const timestamp = Date.now();
    const stringToSign = `${timestamp}\n${secret}`;
    const hmac = crypto.createHmac('sha256', secret);
    const signData = hmac.update(stringToSign).digest('base64');
    const sign = encodeURIComponent(signData);
    return { timestamp, sign };
}

/**
 * 发送Webhook消息
 * @param url 钉钉机器人Webhook URL
 * @param data 发送的消息内容
 */
async function sendWebhook(url: string, data: any): Promise<Response> {
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

/**
 * 通知函数
 * @param message 发送的消息
 */
export async function notify(message: string): Promise<void> {
    const webhook_url = 'https://oapi.dingtalk.com/robot/send?access_token=5567b2ed508a9757acca984c5e0826a13e1e8e720d1b351e7eb909ebabb6899f';
    const secret = 'SEC57abed8a54a5d0ed558c4eef2549f518010edbf9f23d0225b52d16494745fb01';

    if (!webhook_url || !secret) {
        console.error('Please set WEBHOOK_URL and secret');
        return;
    }

    // 生成签名和时间戳
    const { timestamp, sign } = generateSignature(secret);

    // 拼接 timestamp 和 sign 到 webhook URL
    const signed_url = `${webhook_url}&timestamp=${timestamp}&sign=${sign}`;

    // 发送消息
    await sendWebhook(signed_url, {
        msgtype: 'text',
        text: { content: message }
    });
}
