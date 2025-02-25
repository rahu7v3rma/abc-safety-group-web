'use client';

import {
   FUNDING,
   PayPalScriptProvider,
   PayPalButtons,
} from '@paypal/react-paypal-js';
import { FC } from 'react';

export type PaypalBody = {
   id: string;
   name: string;
   price: number;
};

interface PaypalProps {
   body: PaypalBody;
   success: (data: PaymentSuccess) => void;
   fail: (description: string) => void;
}

export type PaymentSuccess = {
   transactionId: string;
};

const Paypal: FC<PaypalProps> = ({ body, success, fail }) => {
   const FUNDING_SOURCES = [FUNDING.PAYPAL, FUNDING.VENMO, FUNDING.CARD];

   const initialOptions = {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      'enable-funding': 'paylater,venmo',
   };

   return (
      <PayPalScriptProvider options={initialOptions}>
         <div className="flex flex-col gap-y-2 mt-10">
            {FUNDING_SOURCES.map((fundingSource) => {
               return (
                  <PayPalButtons
                     fundingSource={fundingSource}
                     key={fundingSource}
                     style={{
                        layout: 'vertical',
                        shape: 'pill',
                     }}
                     createOrder={async (data, actions) => {
                        try {
                           const response = await fetch(
                              `${process.env.NEXT_PUBLIC_ORDERS_API}/orders`,
                              {
                                 method: 'POST',
                                 body: JSON.stringify(body),
                              }
                           );

                           const details = await response.json();
                           return details.id;
                        } catch (error) {
                           console.error(error);
                        }
                     }}
                     onApprove={async (data, actions) => {
                        try {
                           const response = await fetch(
                              `${process.env.NEXT_PUBLIC_ORDERS_API}/orders/${data.orderID}/capture`,
                              {
                                 method: 'POST',
                                 body: JSON.stringify(body),
                              }
                           );

                           const details = await response.json();

                           const errorDetail =
                              Array.isArray(details.details) &&
                              details.details[0];

                           if (
                              errorDetail &&
                              errorDetail.issue === 'INSTRUMENT_DECLINED'
                           ) {
                              return actions.restart();
                           }

                           if (errorDetail) {
                              fail(errorDetail.description);
                              console.error(details.debug_id);
                           }
                           success({
                              transactionId: details.id,
                           });
                        } catch (error) {
                           console.error(error);
                        }
                     }}
                  />
               );
            })}
         </div>
      </PayPalScriptProvider>
   );
};

export default Paypal;
