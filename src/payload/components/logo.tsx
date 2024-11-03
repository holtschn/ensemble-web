import Image from 'next/image';

const LogoComponent: React.FC = () => {
  return (
    <div>
      <Image src="/logo/pictos_black.webp" alt="Logo" width={450} height={150} />
    </div>
  );
};

export default LogoComponent;
