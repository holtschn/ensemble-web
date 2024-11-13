'use client';

import React, { useEffect } from 'react';
import { useAnimation } from '@/next/animation/context';

export const AnimateHeaderWrapper: React.FC<{ children: React.ReactNode; animateHeader: boolean }> = ({
  children,
  animateHeader,
}) => {
  const { setAnimateHeaderOnScroll } = useAnimation();
  useEffect(() => {
    setAnimateHeaderOnScroll(animateHeader);
  }, [setAnimateHeaderOnScroll]);

  return <div>{children}</div>;
};
