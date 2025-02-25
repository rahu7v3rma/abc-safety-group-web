const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         keyframes: {
            slideDownAndFade: {
               from: { opacity: 0, transform: 'translateY(-5px)' },
               to: { opacity: 1, transform: 'translateY(0)' },
            },
            slideLeftAndFade: {
               from: { opacity: 0, transform: 'translateX(5px)' },
               to: { opacity: 1, transform: 'translateX(0)' },
            },
            slideUpAndFade: {
               from: { opacity: 0, transform: 'translateY(5px)' },
               to: { opacity: 1, transform: 'translateY(0)' },
            },
            slideRightAndFade: {
               from: { opacity: 0, transform: 'translateX(-5px)' },
               to: { opacity: 1, transform: 'translateX(0)' },
            },
            fadeIn: {
               from: { opacity: 0 },
               to: { opacity: 1 },
            },
            overlayShow: {
               from: { opacity: 0 },
               to: { opacity: 1 },
            },
            contentShow: {
               from: {
                  opacity: 0,
                  transform: 'translate(-50%, -48%) scale(0.96)',
               },
               to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            },
         },
         animation: {
            slideDownAndFade:
               'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideLeftAndFade:
               'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideUpAndFade:
               'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideRightAndFade:
               'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            fadeIn: 'fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
         },
         colors: {
            abc_blue: '#0d73d9',
            abc_darkblue: '#4800ad',
            abc_orange: '#f0a30a',
         },
         boxShadow: Object.fromEntries(
            Object.keys(colors)
               .slice(3)
               .map((color) => [
                  `inner-${color}`,
                  `0px 1.5px 0px 0px ${colors[color]['300']} inset`,
               ])
         ),
      },
   },
   plugins: [],
};
