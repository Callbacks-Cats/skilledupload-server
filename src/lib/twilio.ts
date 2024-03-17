import twilio from 'twilio';

let ssid = 'ACe52f20d64810819cc28578a622c46b2a';
let authToken = 'ad12c47aac7e6275bd9a12d14d0efc69';
let from = '+15165060649';
const client = twilio(ssid, authToken);

export const verifyNumber = async (to: string) => {
  const respnose = await client.verify.v2.services(ssid).verifications.create({
    to: `+88${to}`,
    channel: 'sms'
  });

  console.log(respnose);
};

export const sendSms = async (to: string, msg: string) => {
  try {
    client.verify.v2.services
      .create({ friendlyName: 'My First Verify Service' })
      .then((service) => console.log(service.sid));

    const verified = verifyNumber(to);

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
