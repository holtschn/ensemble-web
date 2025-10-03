import Link from 'next/link';

const AdminLinks: React.FC = () => {
  return (
    <>
      <div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          Startseite
        </Link>
      </div>
      <div style={{ paddingBottom: '16px' }}>
        <Link href="/intern" style={{ textDecoration: 'none' }}>
          Interne Startseite
        </Link>
      </div>
    </>
  );
};

export default AdminLinks;
