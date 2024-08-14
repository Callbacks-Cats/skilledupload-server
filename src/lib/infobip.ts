import { AuthType, Infobip } from '@infobip-api/sdk';

export const client = new Infobip({
  baseUrl: '1vzm1k.api.infobip.com',
  apiKey: 'b01bc53d87a764ccf5bf1f92f356c199-03380cd0-4207-4fcc-a337-ecc7bc10b5a1',
  authType: AuthType.ApiKey
});

export const sendSms = async (to: string, msg: string) => {
  try {
    const infobipResponse = await client.channels.sms.send({
      type: 'text',
      messages: [
        {
          destinations: [
            {
              to: `+88${to}`
            }
          ],
          from: 'Skilledupload',
          text: msg
        }
      ]
    });

    console.log(infobipResponse, 'infobipResponse');
  } catch (error) {
    console.log(error);
  }
};
