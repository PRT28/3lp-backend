require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const swaggerFile = require("./swagger_output.json");

const authRoutes = require('./routes/auth');
const attendenceRoutes = require('./routes/attendence');

const app = express();

app.use(helmet());
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
app.use('/attendence', attendenceRoutes);

const PORT = process.env.PORT || 80;


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connection successfull");
    app.listen(PORT, () => console.log("Server running on PORT:", PORT));
})
.catch(err => console.error(err));

