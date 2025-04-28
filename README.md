# Airline Booking API

A simple Node.js/Express API for airline booking, airport lookup, and flight search. Data is stored in JSON files for airports and flights.

## Features
- List all airports
- List destination airports from a departure code
- Search for flights between airports (multiple daily flights, no specific dates)
- Book a flight (with outbound/return flight numbers and dates)
- OpenAPI (Swagger) documentation at `/api-docs`

## Endpoints

### GET /airports
Returns a list of all airports.

### GET /airports/{code}/destinations
Returns a list of destination airports from a given departure airport code.

### GET /flights?from=XXX&to=YYY
Returns all available flights between two airports (multiple per day, no date filtering).

### POST /book
Book a flight. Example request body:
```json
{
  "fromDate": "2025-05-01",
  "toDate": "2025-05-10", // optional
  "outboundFlightNumber": "AA100",
  "returnFlightNumber": "AA101", // optional
  "passengerId": "12345"
}
```

## API Documentation
Interactive docs available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Running Locally
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node index.js
   ```
3. The API will be available at [http://localhost:3000](http://localhost:3000)

## Deployment
You can deploy this app to Azure App Service using the Azure CLI. See the OpenAPI spec and comments for details.

---

**Note:**
- Make sure to use `process.env.PORT || 3000` in your code for Azure compatibility.
- Data is stored in `data/airports.json` and `data/flights.json`.
