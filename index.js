const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const airportsPath = path.join(__dirname, 'data', 'airports.json');
const flightsPath = path.join(__dirname, 'data', 'flights.json');
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function getAirports() {
  return JSON.parse(fs.readFileSync(airportsPath)).airports;
}

function getFlights() {
  return JSON.parse(fs.readFileSync(flightsPath)).flights;
}

// 1. List all airports
app.get('/airports', (req, res) => {
  res.json(getAirports());
});

// 2. List destination airports from a departure code
app.get('/destinations', (req, res) => {
  const code = req.query.code?.toUpperCase();
  if (!code) {
    return res.status(400).json({ error: 'code query parameter is required' });
  }
  const flights = getFlights();
  const destinations = flights
    .filter(f => f.from === code)
    .map(f => f.to);
  const airports = getAirports().filter(a => destinations.includes(a.code));
  res.json(airports);
});

// 3. Return flight options
app.get('/flights', (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'from and to are required' });
  }
  // Ignore date, just return all flights between from and to
  const flights = getFlights().filter(f => f.from === from && f.to === to);
  res.json({ flights });
});

// 4. Book a flight
app.post('/book', (req, res) => {
  const { fromDate, toDate, outboundFlightNumber, returnFlightNumber, passengerId } = req.body;
  if (!fromDate || !outboundFlightNumber || !passengerId) {
    return res.status(400).json({ error: 'Missing fromDate, outboundFlightNumber, or passengerId' });
  }
  // In a real app, booking would be saved to a DB. Here, just return a confirmation.
  res.json({
    message: 'Booking confirmed',
    fromDate,
    toDate: toDate || null,
    outboundFlightNumber,
    returnFlightNumber: returnFlightNumber || null,
    passengerId
  });
});

// Endpoint to return the raw OpenAPI YAML spec
app.get('/spec', (req, res) => {
  res.type('text/yaml');
  res.send(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));
});

app.listen(PORT, () => {
  console.log(`Airline API server running on port ${PORT}`);
});
