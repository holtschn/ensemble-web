import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/next/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [  ]
  // plugins: [
  //   plugin(function ({ addComponents }) {
  //     addComponents({
  //       '.peter-column': {
  //         '@apply xl:w-[980px] lg:w-[820px] md:w-[580px] w-[273px] mx-auto': {},
  //       },
  //     });
  //   }),
  // ],
};
export default config;
