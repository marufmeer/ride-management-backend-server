🚖 Ride Booking System Backend (Uber/Pathao-like)

A secure, scalable, and role-based backend API for a ride booking system, built using Express.js and Mongoose.

The system allows riders to request rides, drivers to accept & complete rides, and admins to manage users, drivers, and rides with role-based access control.

✨ Features
🔐 Authentication & Authorization

JWT-based authentication

Three roles: Admin, Rider, Driver

Secure password hashing with bcrypt

Role-based route protection middleware

🧍 Rider Features

Request a ride with pickup & destination (lat/lng coordinates)

Cancel a ride (before driver accepts)

View ride history

🚗 Driver Features

Accept or reject ride requests

Update ride status: Picked Up → In Transit → Completed

View earnings history

Set availability status (Online/Offline)

👨‍💼 Admin Features

View all users, drivers, and rides

Approve / suspend drivers

Block / unblock riders

Generate reports (optional)

📜 Ride Management

Complete ride lifecycle: requested → accepted → picked_up → in_transit → completed

Status & timestamp logging

Prevent multiple active rides per user/driver

Handle cancellations with business rules

🧠 Design Decisions

User Representation:

Single User model with role field (admin, rider, driver).

Drivers have extra fields: vehicleInfo, availabilityStatus, approvalStatus.

Ride Matching:

Riders create requests.

Drivers can accept/reject manually (auto-matching can be extended later).

Access Rules:

Riders can only view their rides.

Drivers can only view rides they accepted.

Admins can view all rides and accounts.

Scalability:

Modular code architecture

Future-ready for microservices (e.g., ride-matching, payments, notifications).
