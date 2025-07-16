# 🏡 Airbnb Clone – MERN Stack

A full-featured Airbnb-style web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Includes secure **JWT authentication**, **bcrypt password hashing**, **file uploads**, **listing management**, and a complete **booking system**.

---

## 🚀 Features

* 🔐 JWT-based user authentication
* 📝 User registration & login
* 🧾 User profile with session persistence
* 🏠 Add, edit & delete property listings
* 📷 Upload photos via file or link (with `multer` and `image-downloader`)
* 📍 Address, perks, and pricing details for listings
* 🗕️ Booking system with check-in, check-out, guests, contact info
* 🗖️ View past bookings
* 🧰 Protected routes via middleware
* 🧪 Passwords hashed using bcrypt
* 🌍 Production-ready deployment support

---

## 🛠️ Tech Stack

### Frontend

* React
* Axios
* Tailwind CSS (optional)
* React Router DOM

### Backend

* Node.js
* Express
* MongoDB & Mongoose
* bcryptjs
* jsonwebtoken
* multer (file uploads)
* cookie-parser
* dotenv

---

## 📁 Project Structure

```
/airbnb-clone
├── /client         # React frontend
├── /api         # Express backend
│   ├── models      # Mongoose schemas
│   ├── routes      # Express routes (auth, listings, bookings)
│   ├── uploads     # Uploaded image files
│   ├── .env        # Environment variables
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone
```

### 2. Setup Backend

```bash
cd api
npm install
touch .env
```

Add the following to your `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=4000
```

Then run the backend:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 🔐 Authentication

* JWT token issued on login, stored in cookies
* bcrypt hashes passwords before storing
* Authenticated routes are protected with JWT verification middleware

---

## 🧪 API Routes Overview

### 🔑 Auth

| Route              | Method | Description         |
| ------------------ | ------ | ------------------- |
| `/api/v1/register` | POST   | Register a new user |
| `/api/v1/login`    | POST   | Login and get token |
| `/api/v1/profile`  | GET    | Get user info       |
| `/api/v1/logout`   | POST   | Logout user         |

### 🏠 Listings

| Route                 | Method | Description         |
| --------------------- | ------ | ------------------- |
| `/api/v1/places`      | GET    | All listings        |
| `/api/v1/user-places` | GET    | Get user's listings |
| `/api/v1/places/:id`  | GET    | Get listing by ID   |
| `/api/v1/places`      | POST   | Create listing      |
| `/api/v1/places`      | PUT    | Update listing      |

### 📷 Uploads

| Route                    | Method | Description          |
| ------------------------ | ------ | -------------------- |
| `/api/v1/upload-by-link` | POST   | Upload photo by link |
| `/api/v1/upload`         | POST   | Upload photo by file |

### 🗕️ Bookings

| Route              | Method | Description              |
| ------------------ | ------ | ------------------------ |
| `/api/v1/bookings` | POST   | Create a new booking     |
| `/api/v1/bookings` | GET    | Get all bookings of user |

---

## 📦 Deployment

For production, the backend serves the built frontend from `client/dist`.

```js
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}
```

---

## 👨‍💼 Author

* **Shivam Tanwar**
* GitHub: [@ShivamTanwar0801](https://github.com/ShivamTanwar0801)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* Inspired by Airbnb
* Thanks to the open-source community
