import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import CarDataa from './carData.json';

const CarInfo = () => {
  const [carsInTunnel, setCarsInTunnel] = useState(null);
  const [trafficLightColor, setTrafficLightColor] = useState('green');
  const [redLight, setRedLight] = useState('white')
  const [greenLight, setGreenLight] = useState('green')
  const [totalCars, setTotalCars] = useState(0); 

  useEffect(() => {
    const totalCarsFromData = CarDataa.data.reduce((acc, item) => acc + item.averageCars, 0);
    setTotalCars(totalCarsFromData);
  }, []);



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

        if (command === 'ON') {
          setGreenLight('white')
          setRedLight('red')
        } else {
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

  // Calculate the percentage of current cars in tunnel
const percentage = carsInTunnel !== null ? Math.floor((carsInTunnel / 30) * 100) : null;

  return (
    <div
      className=""
      style={{
        backgroundColor: '#E2DFD2',
        padding: '5px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center the content horizontally
      }}
    >
      <div className='mt-5'>
        <h1 className='text-center mt-5'>Tunnel Control Panel</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
       

        {/* Container with the number of cars */}
        <div style={{ marginLeft: '20px' }}>
          <div className="text-center p-5 mt-5" style={{ backgroundColor: '#FAF9F6', borderRadius: '15px' }}>
            <h2>Cars In Tunnel</h2>
            {carsInTunnel !== null ? (
              <h3 className='text-center' style={{ fontSize: '400%' }}>{carsInTunnel}</h3>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* Container with the traffic */}

        <div style={{ marginLeft: '20px' }}>
          <div className="text-center p-5 mt-5" style={{ backgroundColor: '#FAF9F6', borderRadius: '15px' }}>
            <h2>Traffic Fluidity</h2>
            {percentage !== null ? (
              <h3 className='text-center' style={{ fontSize: '400%' }}>{percentage}%</h3>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        {/* Container with the percentage of current cars in tunnel */}
        <div style={{ marginLeft: '20px' }}>
          <div className="text-center p-5 mt-5" style={{ backgroundColor: '#FAF9F6', borderRadius: '15px' }}>
            <h2>Tunnel Capacity</h2>
            {percentage !== null ? (
              <h3 className='text-center' style={{ fontSize: '400%' }}>{percentage}%</h3>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
   {/* Container with the traffic Fluidity */}

   
 
  {/* Container with traffic light and buttons */}
  <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,margin:10}}>
    <div className="text-center p-4 mt-5 mr-5" style={{ backgroundColor: '#FAF9F6', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
            {/* Container for traffic light */}
            <div>
              <TrafficLight />
            </div>
            {/* Container for buttons */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button className='btn btn-danger m-2' onClick={() => sendCommand('ON')}>Turn ON Red Light</button>
              <button className='btn btn-success m-2' onClick={() => sendCommand('OFF')}>Turn On Green Light</button>
            </div>
    </div>
  </div>

   {/* Container with the total cars */}
   <div style={{ marginLeft: '20px' , margin:10}}>
        <div className="text-center p-4 mt-5 " style={{ backgroundColor: '#FAF9F6', borderRadius: '15px' }}>
          <h2>Total Cars Today</h2>
          {totalCars !== 0 ? (
            <h3 className='text-center' style={{ fontSize: '400%' }}>{totalCars}</h3>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

   
</div>

          <div className="text-center p-4 mb-5 mt-5 " style={{ backgroundColor: '#FAF9F6', borderRadius: '15px' , margin:10}}>
            <h2>Average Cars in the Tunnel per Hour</h2>
      <BarChart />
     
 </div>


 </div>


</div>
  );
};

export default CarInfo;