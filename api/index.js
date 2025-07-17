const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI);

const bcryptSalt = bcrypt.genSaltSync();
const jwtSecret = "daadacfawaafadcadafqfadcafafsada";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "https://airbnb-clone-shivam-tanwar.onrender.com"
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/v1/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    });

    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(userDoc);
      });
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(422).json("not found");
  }
});

app.get("/api/v1/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/api/v1/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/api/v1/upload-by-link", async (req, res) => {
  const { link } = req.body;

  try {
    const result = await cloudinary.uploader.upload(link, {
      folder: "airbnb-clone",
    });

    res.json(result.secure_url); // send back Cloudinary image URL
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "airbnb-clone", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const photosMiddleware = multer({ storage });

app.post("/api/v1/upload", photosMiddleware.array("photos", 100), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  console.log(req.files);
  const uploadedUrls = req.files.map((file) => file.path);

  res.json(uploadedUrls);
});

app.post("/api/v1/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });
    res.json(placeDoc);
  });
});

app.get("/api/v1/user-places", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    });
  } else {
    res.json(null);
  }
});

app.get("/api/v1/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/api/v1/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/api/v1/places", async (req, res) => {
  res.json(await Place.find());
});

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
};

app.post("/api/v1/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);

  const { checkIn, checkOut, numberOfGuests, name, phone, place, price } =
    req.body;

  Booking.create({
    user: userData.id,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    place,
    price
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/api/v1/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(port);
