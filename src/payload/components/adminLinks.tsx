import Link from 'next/link';

const AdminLinks: React.FC = () => {
  return (
    <div style={{ paddingBottom: '16px' }}>
      <Link href="/">Startseite</Link>
      <Link href="/intern">Interne Startseite</Link>
    </div>
  );
};

export default AdminLinks;
