const express = require('express');
const { SerialPort } = require('serialport');
const bodyParser = require('body-parser');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const ledPin1 = 2;
const ledPin2 = 13;
const detectorPin1 = 10;
const detectorPin2 = 11;
let lastState1 = true;
let lastState2 = true;
let carsInTunnel = 0;

const serialPort = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

serialPort.on('open', () => {
  console.log('Serial port is open');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ carsInTunnel }));
  });

  app.post('/api/close_tunnel', (req, res) => {
    if (req.body.command === 'ON') {
      serialPort.write('LED2_ON\n', function(err) {
        if (err) {
          return console.log('Error writing to serial port:', err.message);
        }
        console.log('Command sent to Arduino: LED2_ON');
      });
    } else {
      serialPort.write('LED2_OFF\n', function(err) {
        if (err) {
          return console.log('Error writing to serial port:', err.message);
        }
        console.log('Command sent to Arduino: LED2_OFF');
      });
    }
    res.json({ status: 'success' });
  });
  

parser.on('data', (data) => {
  console.log('Data from Arduino:', data);
  carsInTunnel = parseInt(data.trim());
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ carsInTunnel }));
    }
  });
});

server.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
  });