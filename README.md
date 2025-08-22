# Smart Home API

A simple RESTful API built with **Node.js, Express, and MongoDB** for managing IoT devices (lights, smart meters, etc.).  
It supports device registration, updates, logs, and usage aggregation.

---

## 🚀 Setup Instructions

### 1. Clone the repo

git clone https://github.com/shrisaksham4/Assignment-smart-device
cd Assignment-smart-device

### 2. Install dependencies
npm install

### 3. Create .env file

Create a .env file in the root directory with the following variables:

PORT=5000
MONGO_URI=mongodb://your_mongodb_atlas_cluster_url
JWT_SECRET=your_jwt_secret

### 4. Start the server
npm start


Server will run at:

http://localhost:5000

### 5. API Documentation
#### Authentication

JWT-based auth is required for all device routes.

Pass token in headers:

Authorization: Bearer <token>

#### Device Endpoints
1. Register Device

POST /devices
Payload:

{
  "name": "Living Room Light",
  "type": "light",
  "status": "active"
}


Response:

{
  "success": true,
  "device": {
    "id": "d1",
    "name": "Living Room Light",
    "type": "light",
    "status": "active",
    "last_active_at": null,
    "owner_id": "u1"
  }
}

2. List Devices

GET /devices?type=light&status=active
Response:

{
  "success": true,
  "devices": [ ... ]
}

3. Update Device

PATCH /devices/:id
Payload (example):

{
  "status": "inactive"
}

4. Delete Device

DELETE /devices/:id

5. Device Heartbeat

POST /devices/:id/heartbeat
Payload:

{ "status": "active" }


Response:

{
  "success": true,
  "message": "Device heartbeat recorded",
  "last_active_at": "2025-08-17T10:15:30Z"
}

6. Create Device Log

POST /devices/:id/logs
Payload (Smart Meter example):

{
  "event": "units_consumed",
  "value": 2.5
}

7. Fetch Device Logs

GET /devices/:id/logs?limit=10
Response:

{
  "success": true,
  "logs": [
    {
      "id": "l1",
      "event": "units_consumed",
      "value": 2.5,
      "timestamp": "2025-08-17T08:00:00Z"
    },
    {
      "id": "l2",
      "event": "units_consumed",
      "value": 1.2,
      "timestamp": "2025-08-17T09:00:00Z"
    }
  ]
}

8. Aggregated Usage

GET /devices/:id/usage?range=24h
Response:

{
  "success": true,
  "device_id": "d2",
  "total_units_last_24h": 15.7
}

### 6. Postman Collection

Import Assignment.postman_collection.json into Postman.

Import Assignment.postman_environment.json for environment variables (e.g., {{base_url}}, {{token}}).

### 7. Assumptions Made

Each device belongs to a single user (via owner_id).

JWT authentication is already implemented and tested.

last_active_at is updated only when a heartbeat is received.

Logs store both event type and numeric value.

Usage aggregation is mainly for devices like smart meters.
