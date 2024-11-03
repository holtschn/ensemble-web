import Image from 'next/image';

const IconComponent: React.FC = () => {
  return (
    <div style={{ width: 28 }}>
      <Image src="/logo/trumpet_black.webp" alt="R(h)einblech Logo" width={18} height={18} />
    </div>
  );
};

export default IconComponent;
