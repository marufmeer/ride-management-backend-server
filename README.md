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
## 🔑 API Endpoints Summary
⚠️ Important Note for Testers: Due to the reasons mentioned in the `"Temporarily Disabled Features"` section, please skip testing any routes related to `Google Login`, `OTP`, `Set Password`, or `password resets`.


Authentication `(/api/v1/auth)`


    Endpoint	        Method	            Description	Required                                            Role(s)
    /login	                POST	            Log in a user with email and password.	                    Public
    /google	                POST	            Log in with goole.	                                        Public
    /refresh-token	        POST	            Generate a new access token using a refresh token.	        Public
    /change-password        POST	            Change the password for a logged-in user.	                  super admin ,admin, rider, driver
    /set-password        POST	                 set the password for google auth logged in user.	          super admin ,admin, rider, driver
    /forgot-password        POST	           forgot  password sending a link of reset password.	          super admin  ,admin, rider, driver
    /reset-password        POST	            Change the password for a logged-in user.	                    super admin  , admin, rider, driver


<br> </br>

User `(/api/v1/user)`


    Endpoint	        Method	            Description	Required                                            Role(s)
    /register	        POST	            Register a new user (defaults to rider role & verified).	         Public
    /me	                GET	            Get the profile of the currently logged-in user.	                 admin, rider, driver
    /all-users             GET	            Get a list of all users.	                                     admin
    /:id                GET	            Get a single user's details by ID.	                               admin
    /:id               PATCH	            Update user information.	                                       admin, rider, driver





<br> </br>

Ride `(/api/v1/rides)`


    Endpoint	        Method	            Description	Required                                            Role(s)
    /ride-request	                POST	            Request a new ride.	                                   rider
    /get-all-rides	                GET	            View all rides in the system	                         super admin, admin
    /get-my-rides               GET	            View personal ride history.	                               rider,driver
    /payment-status-update/:rideId        PATCH	    Update payment status after complete the ride.	       rider
   /ride-status-update/:rideId    PATCH	            ride status update by user and driver.	               user,driver
    /:rideId                      GET                get single ride                                       admin




<br> </br>

Driver `(/api/v1/drivers)`


    Endpoint	                        Method	            Description	Required                                            Role(s)
    /driver-apply                        POST	            Submit an application to become a driver.	                      rider
    /all-drivers                         GET	            View all pending driver applications.	                          super admin,admin
    /approve/:id                           PATCH            approved or reject driver.  	                                super admin, admin
    /:id                                    GET	              get single driver.	                                        admin
    /:id      PATCH	                                     Update driver.	                    admin  ,driver   
 






<br> </br>

Analytics `(/api/v1/stats)`


    Endpoint	                        Method	            Description	Required                                            Role(s)
    /driver                                  GET	            Get dashboard statistics for the admin panel.	           super admin, admin
    /user                                 GET	            Get dashboard statistics for the admin panel.	               super,admin admin
    /ride                                GET	            Get dashboard statistics for the admin panel.	               super,admin





<br> </br>
Analytics `(/api/v1/otp)`


    Endpoint	                        Method	            Description	Required                                            Role(s)
    /send                               POST                send otp for verify the user	                                 User
    /verify                                POST                       verify the otp                                       User
    /resend                                POST 	            resend otp	                                                 User





<br> </br>
## 📦 Installation

###### 1. Clone the repository: 
```
 git clone https://github.com/codewithsaidul/ride-booking-system-assignment-five

 cd ride-booking-system-assignment-five/server

```
###### 2. Install dependencies:

```
 npm install
```


<br> </br>

###### 3. Set up environment variables:

Create a `.env` file in the root directory. For your convenience, an example file (`env.example`) is provided. You can simply copy this file and rename it to `.env`, then update the values with your actual configuration.



.env.example


```

PORT =3000
DB_URL =mongodb://localhost:27017/your_db_name
NODE_ENV =development
BCRYPT_SALT_ROUND =10

# Express Session Secret
EXPRESS_SESSION_SECRET=your_session_secret_here



JWT_ACCESS_SECRET =your_jwt_access_secret_here
JWT_ACCESS_EXPIRATION_TIME =1d
JWT_REFRESH_SECRET =your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRATION_TIME =30d


ADMIN_EMAIL =your_admin_email_here
ADMIN_PASSWORD =your_admin_password_here


GOOGLE_CLIENT_ID =your_google_client_id_here
GOOGLE_CLIENT_SECRET =your_google_client_secret_here
GOOGLE_CALLBACK_URL =your_google_callback_url_here


FRONTEND_URL =your_frontend_url_here




# SMTP GMAIL
# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-smtp-username@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM="Your App Name <no-reply@example.com>"




# REDIS SETUP
# REDIS Configuration (for storing otp)
REDIS_HOST =your_redist_host
REDIS_PORT =your_redis_port
REDIS_USERNAME =your_redis_username
REDIS_PASSWORD =your_redis_password



```

<br> </br>

###### 4. Run the application in development mode:
This will start the server with ts-node-dev, which automatically restarts on file changes.



```
npm run dev
```


###### 5. Build for production:


```
npm run build
```


###### 6. Start the production server:


```
npm run start 

```


The server will be running on `http://localhost:5000`. You can now use an API client like Postman to test the endpoints.

<br> </br>



## 🧑‍💻 Author

##### MARUF MEER

Frontend Dev | Backend Learner | MERN Stack Enthusiast
<br>
GitHub: @marufmeer
