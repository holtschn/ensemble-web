import { Lexend } from 'next/font/google';
import { Lekton } from 'next/font/google';

import { Settings } from '@/payload-types';

const lektonFont = Lekton({
  weight: '400',
  subsets: ['latin'],
  display: 'auto',
});

const lexendFont = Lexend({
  weight: '300',
  subsets: ['latin'],
  display: 'auto',
});

export const getFont = async (fontFamily?: Settings['fontFamily']) => {
  if (fontFamily === 'lekton') {
    return lektonFont;
  }
  return lexendFont;
};
