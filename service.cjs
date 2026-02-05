const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
const port = 5001;

// Configura el puerto serial
const serial = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 });
const parser = serial.pipe(new ReadlineParser({ delimiter: '\n' }));

let sensorData = {
  humedad: 0,
  temperatura: 0,
};

parser.on('data', (line) => {
  const match = line.match(/humedad:\s*(\d+),\s*temperatura:\s*([\d.]+)/i);
  if (match) {
    sensorData.humedad = parseInt(match[1]);
    sensorData.temperatura = parseFloat(match[2]);
    console.log('Datos recibidos:', sensorData);
  }
});

app.use(cors());

app.get('/sensores', (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
