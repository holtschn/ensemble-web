'use client';

import React, { createContext, useContext, useState } from 'react';

type AnimationContext = {
  animateHeaderOnScroll: boolean;
  setAnimateHeaderOnScroll: (value: boolean) => void;
};

type UseAnimation = () => AnimationContext;
const Context = createContext({} as AnimationContext);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animateHeaderOnScroll, setAnimateHeaderOnScroll] = useState<boolean>(() => false);
  return (
    <Context.Provider
      value={{
        animateHeaderOnScroll,
        setAnimateHeaderOnScroll,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAnimation: UseAnimation = () => useContext(Context);
