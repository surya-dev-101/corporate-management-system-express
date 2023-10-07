// create connection to mongodb and start listening the app on 3000 port with all dependecies added

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((e) => {
    console.log("Connected to cloud mongodb database");
}).catch((err) => {
    console.log("Failed to connect to cloud mongodb database: " +err);
});

app.use(cors());

app.use(express.json());

// const userRoute = require("./routes/user");

// app.use("/user", userRoute); 

app.listen(port, () => {
    console.log(`Server started and listening on port: ${port}`);
});
