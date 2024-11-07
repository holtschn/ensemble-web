import Image from 'next/image';

const LogoComponent: React.FC = () => {
  return (
    <div>
      <Image src={`/${process.env.ASSET_SUBDIRECTORY}/payload_cms_logo.webp`} alt="Logo" width={450} height={150} />
    </div>
  );
};

export default LogoComponent;
