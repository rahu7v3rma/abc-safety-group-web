import Pika from 'pika-id';

export async function handleResponse(response: any) {
   if (response.status === 200 || response.status === 201) {
      return response.json();
   }

   const errorMessage = await response.text();
   throw new Error(errorMessage);
}

export const generateAccessToken = async () => {
   try {
      const auth = Buffer.from(
         process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID +
            ':' +
            process.env.PAYPAL_SECRET
      ).toString('base64');
      const response = await fetch(
         `${process.env.PAYPAL_BASE}/v1/oauth2/token`,
         {
            method: 'post',
            body: 'grant_type=client_credentials',
            headers: {
               Authorization: `Basic ${auth}`,
            },
         }
      );

      const data = await response.json();
      return data.access_token;
   } catch (error) {
      console.error('Failed to generate Access Token:', error);
   }
};

export const pika = new Pika([
   'transaction',
   {
      prefix: 'tid',
      description: 'Transaction ID',
   },
]);
