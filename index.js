const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Mongoose = require("./DBconfing/DBconnection");
const httpStatusText = require("./Enums/httpStatusText");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const brandRouter = require("./routes/brands");
const orderRouter = require("./routes/orders");
const path = require("path");
const verfiyToken = require("./middlewares/verfiyToken");
const updateOrderStatus = require("./services/updateOrderStatus");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(cookieParser());

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//services
updateOrderStatus();

//routes
app.use("/api/user", usersRouter);
app.use("/api/product", verfiyToken, productsRouter);
app.use("/api/category", verfiyToken, categoriesRouter);
app.use("/api/brand", verfiyToken, brandRouter);
app.use("/api/order", verfiyToken, orderRouter);

// //Dbconnect
Mongoose.then(() => {
  console.log("connected to mongoDB server");
}).catch((e) => {
  console.log("failed", e.message);
});

// global routes handlers is not found
app.all("*", (req, res, next) => {
  return res.send({
    status: httpStatusText.ERROR,
    message: "this resource is not available",
  });
});

// global error handler
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).send({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

require("./Confing/passportConfig")(app);

//prot
const Port = process.env.Port || 5000;
app.listen(Port, () => console.log(`server is running on port ${Port}`));
