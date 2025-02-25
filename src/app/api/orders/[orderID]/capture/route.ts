import { NextResponse } from 'next/server';
import { generateAccessToken, handleResponse } from '../../../lib';

const capturePayment = async (orderID: string) => {
   const accessToken = await generateAccessToken();
   const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`;

   const response = await fetch(url, {
      method: 'post',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken}`,
      },
   });

   return handleResponse(response);
};

export async function POST(
   request: Request,
   { params }: { params: { orderID: string } }
) {
   try {
      const { orderID } = params;
      const response = await capturePayment(orderID);

      return NextResponse.json(response);
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         {
            message: 'Failed to capture order.',
         },
         { status: 500 }
      );
   }
}
