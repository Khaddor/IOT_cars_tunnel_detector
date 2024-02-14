import React, { useState, useEffect } from 'react';

const CarInfo = () => {
  const [carsInTunnel, setCarsInTunnel] = useState(null);


 

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:3000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCarsInTunnel(data.carsInTunnel);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Car Information</h2>
      {carsInTunnel !== null ? (
        <p>Actual Number of Cars in Tunnel: {carsInTunnel}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CarInfo;
