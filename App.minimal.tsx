import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#0a0b0e',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div>
        <h1>VectorForge</h1>
        <p>React is working!</p>
        <p>Now loading full app...</p>
      </div>
    </div>
  );
};

export default App;

