import Image from 'next/image';

const IconComponent: React.FC = () => {
  return (
    <div style={{ width: 28 }}>
      <Image src={`/${process.env.ASSET_SUBDIRECTORY}/payload_cms_icon.webp`} alt="Icon" width={18} height={18} />
    </div>
  );
};

export default IconComponent;
