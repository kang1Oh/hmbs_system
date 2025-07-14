import { useEffect, useState } from 'react';
import axios from 'axios';

function TestConnection() {
  console.log('🔍 TestConnection is rendering');
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/`)
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        setMessage('❌ Failed to connect to backend');
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Backend Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;
