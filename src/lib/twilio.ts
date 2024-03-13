import twilio from 'twilio';

let ssid = 'AC04773df4361b35fa2fb1a060660619e8';
let authToken = '596badd407a499ccbf67e0b6685528c5';
let from = '+18306896322';
const client = twilio(ssid, authToken);

export const sendSms = async (to: string, msg: string) => {
  try {
    const message = await client.messages.create({
      body: msg,
      from: from,
      to: `+88${to}`
    });

    console.log(message, 'message');
  } catch (error) {
    console.log(error);
  }
};
