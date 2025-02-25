import { NextResponse } from 'next/server';

import { generateAccessToken, handleResponse, pika } from '../lib';
import config from '@/config';

const createOrder = async (id: string, name: string, price: number) => {
   const accessToken = await generateAccessToken();

   const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;

   price = price || 1;

   const payload = {
      intent: 'CAPTURE',
      purchase_units: [
         {
            invoice_id: pika.gen('transaction'), // id to provide if they think there is an issue [ 1 .. 127 ] characters
            soft_descriptor: config.name, // this shows up on the clients transaction statement [ 1 .. 22 ] characters
            items: [
               {
                  sku: id, //UUID <= 127 characters
                  name: name, // item name [ 1 .. 127 ] characters
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                     currency_code: 'USD',
                     value: `${price}`,
                  },
               },
            ],
            amount: {
               value: `${price}`,
               currency_code: 'USD',
               breakdown: {
                  item_total: {
                     value: `${price}`,
                     currency_code: 'USD',
                  },
               },
            },
         },
      ],
      application_context: {
         shipping_preference: 'NO_SHIPPING',
      },
   };

   const response = await fetch(url, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
   });

   return handleResponse(response);
};

export async function POST(request: Request) {
   try {
      const body = await request.json();

      const response = await createOrder(body.id, body.name, body.price);
      return NextResponse.json(response);
   } catch (error) {
      console.error('Failed to create order:', error);
      return NextResponse.json(
         { message: 'Failed to create order' },
         { status: 500 }
      );
   }
}
