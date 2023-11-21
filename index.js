require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const fileUplaod = require('express-fileupload')
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const swaggerFile = require("./swagger_output.json");

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const assignOrderRoutes = require('./routes/assignOrder');
const attendenceRoutes = require('./routes/attendence');
const NotificationRoutes = require('./routes/riderNotification');
const fileUpload = require("express-fileupload");

const app = express();

app.use(helmet());
app.use(fileUpload());
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json());
app.use(cookieParser());
app.get('/crash', () => {
    process.exit();
});


app.use('/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/assign', assignOrderRoutes);
app.use('/attendence', attendenceRoutes);
app.use('/notification', NotificationRoutes);

const PORT = process.env.PORT || 3000 ;


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connection successfull");
    app.listen(PORT, () => console.log("Server running on PORT:", PORT));
})
.catch(err => console.error(err));

