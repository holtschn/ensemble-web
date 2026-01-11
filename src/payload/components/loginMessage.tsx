const LoginMessage: React.FC = () => (
  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
    <p>Please use your personal {process.env.ENSEMBLE_NAME}-Mailaddress.</p>
  </div>
);

export default LoginMessage;
