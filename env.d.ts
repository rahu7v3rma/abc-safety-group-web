type EnvBool = 'true' | 'false';

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NEXT_PUBLIC_API_URL: string;
         NEXT_PUBLIC_COOKIE_NAME: string;
         NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
         PAYPAL_SECRET: string;
         PAYPAL_BASE: string;
         NEXT_PUBLIC_ORDERS_API: string;
         NEXT_PUBLIC_ALLOW_PAYMENTS: EnvBool;
         NEXT_PUBLIC_ALLOW_REGISTER: EnvBool;
         NEXT_PUBLIC_ALLOW_SELF_PACED_COURSES: EnvBool;
         NEXT_PUBLIC_ALLOW_LIVE_CLASSROOM_MANAGEMENT: EnvBool;
         ALLOW_STUDENT_PANEL: EnvBool;
         ALLOW_INSTRUCTOR_PANEL: EnvBool;
         ALLOW_TRAINING_CONNECT_UPLOAD_USER: EnvBool;
         ALLOW_TRAINING_CONNECT_UPDATE_USER: EnvBool;
         ALLOW_TRAINING_CONNECT_UPLOAD_CERTIFICATE: EnvBool;
      }
   }
}

export {};
