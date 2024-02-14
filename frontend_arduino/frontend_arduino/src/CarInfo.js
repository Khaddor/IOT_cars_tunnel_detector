import { use } from 'chai';
import React, { useState, useEffect } from 'react';

const CarInfo = () => {
  const [carsInTunnel, setCarsInTunnel] = useState(null);
  const [trafficLightColor, setTrafficLightColor] = useState('green');
  const [redLight, setRedLight] = useState('white')
  const [greenLight, setGreenLight] = useState('white')

  const sendCommand = (command) => {
    fetch(`http://127.0.0.1:3000/api/close_tunnel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Command sent successfully:', data);

        // Update traffic light color based on the command
        // setTrafficLightColor(command === 'ON' ? setRedLight('red') && setGreenLight('white') : setGreenLight('green') && setRedLight('white'));
        if (command === 'ON'){
            setGreenLight('white')
            setRedLight('red') 
        }else{
            setRedLight('white')
            setGreenLight('green') 
        }
      })
      .catch((error) => {
        console.error('Error sending command:', error);
      });
  };

  const TrafficLight = () => {
    return (
      <div className="App" style={{ border: '2px solid black', width: '70px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: redLight,
            border: 'solid 1px black',
            borderRadius: '50%',
            margin: '10px',
          }}
        />
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: greenLight,
            border: 'solid 1px black',
            borderRadius: '50%',
            margin: '10px',
          }}
        />
      </div>
      
    );
  };

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

      <TrafficLight />
      <button onClick={() => sendCommand('ON')}>Turn ON</button>
      <button onClick={() => sendCommand('OFF')}>Turn OFF</button>
    </div>
  );
};

export default CarInfo;
