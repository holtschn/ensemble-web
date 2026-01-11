import React from 'react';

const LoginMessage: React.FC = () => {
  const ensembleName = process.env.ENSEMBLE_NAME || 'ensemble';

  return (
    <div className="mb-5 text-center">
      <p>Please use your personal {ensembleName}-Mailaddress.</p>
    </div>
  );
};

export default LoginMessage;
