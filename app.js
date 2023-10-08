// create connection to mongodb and start listening the app on 3000 port with all dependecies added

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const ownerRouter = require("./routers/ownerRouter")
const organizationRouter = require("./routers/organizationRouter")
const projectRouter =  require("./routers/projectRouter")
const loginRouter = require("./routers/loginRouter")
const managerRouter = require("./routers/managerRouter")
const employeeRouter = require("./routers/employeeRouter")

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
app.use("/login", loginRouter);
app.use("/owner", ownerRouter); 
app.use("/project", projectRouter);
app.use("/organization", organizationRouter);
app.use("/manager", managerRouter);
app.use("/employee", employeeRouter);

app.listen(port, () => {
    console.log(`Server started and listening on port: ${port}`);
});
