import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    fetch('https://horospokus-production.up.railway.app/')
      .then(res => res.text())
      .then(data => setMessage(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://horospokus-production.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, dob })
      });
  
      const data = await res.json();
      setMessage(data.result);
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong.');
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <p>Horospokus</p>
        <p>Get your daily Horoscope for free</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="First Name" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input 
            type="date" 
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button type="submit">Get Horoscope</button>  
        </form>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;

