# 🚖 Ride Booking System Backend (Uber/Pathao-like)

A **secure, scalable, and role-based backend API** for a ride booking system, built using **Express.js** and **Mongoose**.  

The system allows **riders to request rides**, **drivers to accept & complete rides**, and **admins to manage users, drivers, and rides** with **role-based access control**.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication  
- Three roles: **Super Admin,Admin, Rider, Driver**  
- Secure password hashing with **bcrypt**  
- Role-based route protection middleware  

### 🧍 Rider Features
- Request a ride with pickup & destination (lat/lng coordinates)  
- Cancel a ride (before driver accepted it)  
- View ride history  

### 🚗 Driver Features
- Accept or reject ride requests  
- Update ride status: **Accepted → Picked Up → In Transit → Completed**  
- View own profile and earnings
- Set availability status (**Online/Offline**)  

### 👨‍💼 Admin Features
- View all users, drivers, and rides  
- Approve / suspend drivers  
- Block / unblock riders  

### 📜 Ride Management
- Complete ride lifecycle:  
  `requested → accepted → picked_up → in_transit → completed`  
- Status & timestamp logging  
- Prevent multiple active rides per user/driver  
- After the ride complete and confirmed the payment to Paid
- When payment is updated to paid fare is sum with driver earnings

---

## 🧠 Design Decisions

### 👥 User Representation
- Single **User model** with `role` field (`super admin`,`admin`, `rider`, `driver`)  
- Drivers have extra fields:  
  - `vehicleInfo`  
  - `availability`  
  - `driverStatus`  

### 🚘 Ride Matching
- Riders create ride requests  
- Drivers can **accept/reject** manually  
- *Ride match with geo location latitude and longtitude*  

### 🔐 Access Rules
- Riders → Can only view their rides  
- Drivers → Can only view rides they accepted  
- Super Admin / Admins → Full system visibility (users, drivers, rides)  

### ⚡ Scalability
- Modular code architecture  
- Future-ready for **microservices** (ride-matching, payments, notifications)  

---

<br> </br>

## 🗂️ Project Structure
The project follows a modular architecture to keep the codebase clean, scalable, and easy to maintain.

```
🗂️ src/
├── app.ts                      # Creates and configures the Express application
├── server.ts                   # Connects to the database and starts the server
│
├── app/
│   ├── modules/
│   │   ├── auth/               # Handles authentication logic
│   │   ├── user/
        ├── otp/              # Handles user management logic
│   │   ├── driver/             # Handles driver-specific logic
│   │   ├── ride/               # Handles ride management logic
│   │   └── stats/          # Handles data analytics for admins
│   │
│   ├── middlewares/            # Contains global middlewares
│   ├── utils/                  # Contains shared utility functions
│   └── config/                 # Contains environment variables and config
│
├── errorHelpers/               # Contains the custom AppError class
│   └── AppError.ts
│
├── helpers/                    # Contains specific error handling functions
│   ├── handleCastError.ts
│   ├── handleDuplicateError.ts
│   ├── handleValidationError.ts
│   └── handleZodError.ts
│
└── ...                           # Other directories as needed

```

<br> </br>


