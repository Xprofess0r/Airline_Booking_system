# ✈️ Flights & Search Service

A **Node.js microservice** for managing flights, airports, cities, and airplanes. Part of a larger Airline Management System — the Booking Service calls this service to get flight prices and update seat counts.

---

## 🏗️ Architecture

```
Booking Service (port 3002)
        │
        │  GET  /api/v1/flights/:id   (get price & seats)
        │  PATCH /api/v1/flights/:id  (decrement seats after booking)
        ▼
Flight & Search Service (this repo — port 3001)
        │
        ▼
   MySQL Database
   (Cities, Airports, Airplanes, Flights tables)
```

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js                        |
| ORM         | Sequelize (with migrations)       |
| Database    | MySQL                             |
| Dev Server  | Nodemon                           |

---

## 📁 Project Structure

```
src/
├── config/
│   ├── config.json          # Sequelize DB config (dev/test/prod)
│   └── serverConfig.js      # Reads PORT from .env
├── controllers/
│   ├── Flight-controller.js
│   ├── airtport-controller.js
│   └── city-controller.js
├── middlewares/
│   └── flight-middlewares.js  # Validates create-flight request body
├── migrations/              # DB schema — run with sequelize-cli
├── models/
│   ├── airplane.js
│   ├── airport.js
│   ├── city.js
│   └── flights.js
├── repository/              # DB operations per model
├── routes/
│   ├── index.js             # Mounts /v1
│   └── v1/index.js          # All route definitions
├── seeders/                 # Sample airports & airplanes
├── services/                # Business logic
└── utils/
    ├── error-codes.js
    └── helper.js            # compareTime utility
```

---

## ⚙️ Prerequisites

- **Node.js** v16+
- **MySQL** running locally

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure the database
Edit `src/config/config.json` — set your MySQL password:
```json
{
  "development": {
    "username": "root",
    "password": "your_password",
    "database": "flight_search_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

Create the database in MySQL:
```sql
CREATE DATABASE flight_search_db;
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
`.env` must contain:
```env
PORT=3001
```
> ⚠️ Port **must be 3001** — the Booking Service is hardcoded to call `localhost:3001`.

### 4. Run migrations
```bash
npx sequelize-cli db:migrate
```

### 5. Seed sample data (optional but recommended)
```bash
npx sequelize-cli db:seed:all
```
This adds sample airports and airplanes so you can create flights immediately.

### 6. Start the server
```bash
npm start
```
Server runs at: `http://localhost:3001`

---

## 📡 API Endpoints

### Flights

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/flights` | Create a flight |
| GET | `/api/v1/flights` | Get all flights (with optional filters) |
| GET | `/api/v1/flights/:id` | Get a single flight ← used by Booking Service |
| PATCH | `/api/v1/flights/:id` | Update a flight ← used by Booking Service |

### Cities

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/city` | Create a city |
| GET | `/api/v1/city` | Get all cities |
| GET | `/api/v1/city/:id` | Get a city |
| PATCH | `/api/v1/city/:id` | Update a city |
| DELETE | `/api/v1/city/:id` | Delete a city |

### Airports

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/airports` | Create an airport |

---

## 🧪 Testing the Full Flow (with Booking Service)

1. **Create a city:**
```json
POST /api/v1/city
{ "name": "Mumbai" }
```

2. **Create an airport:**
```json
POST /api/v1/airports
{ "name": "CSIA", "cityId": 1 }
```

3. **Create a flight** (uses airplaneId from seeded data — id: 1):
```json
POST /api/v1/flights
{
  "flightNumber": "AI-101",
  "airplaneId": 1,
  "departureAirportId": 1,
  "arrivalAirtportId": 2,
  "departureTime": "2025-12-01T08:00:00.000Z",
  "arrivalTime": "2025-12-01T10:00:00.000Z",
  "price": 4500
}
```

4. **Book the flight** (in Booking Service on port 3002):
```json
POST http://localhost:3002/api/v1/bookings
{
  "flightId": 1,
  "userId": 1,
  "noOfSeats": 2
}
```

---

## 🐛 Bugs Fixed (from original repo)

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `src/index.js` | Port hardcoded to `3000`, ignoring `.env` — Booking Service expects `3001` | Use `PORT` from env with fallback `3001` |
| 2 | `src/index.js` | Unused imports (`CityRepository`, `Airport`, `City`) causing noise | Removed |
| 3 | `package.json` | `npm start` ran `nodemon start ./src/index.js` — passes `start` as a file arg to nodemon | Fixed to `npx nodemon src/index.js` |
| 4 | `services/crud-service.js` | `get()` called `this.repository.destroy(id)` instead of `this.repository.get(id)` — would delete records on GET! | Fixed to call correct method |
| 5 | `repository/flight-repository.js` | Filter used `arrivalAirportId` but DB column is `arrivalAirtportId` (typo) — filter silently did nothing | Fixed key to match schema |
| 6 | `repository/flight-repository.js` | `updateFlight()` returned `true` (a boolean) — Booking Service needs the updated flight object | Now returns the updated `Flights` record |
| 7 | `src/config/config.json` | Missing from repo (gitignored) — app crashes on start | Added with default dev config |
| 8 | `.env.example` | No example env file | Created |
