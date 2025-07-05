'use client';

import React from 'react';
import Image from 'next/image';

const Icon: React.FC<{ name: string; alt: string; className?: string }> = ({ name, alt, className }) => (
  <Image
    src={`/icons/${name}.svg`}
    alt={alt}
    width={8}
    height={8}
    className={`inline-block ${className || ''}`}
    aria-hidden="true"
  />
);

export default Icon;
