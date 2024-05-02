const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require('./api/Models')
const userRoutes = require ('./api/Routes/userRoutes')
const cors = require("cors");
const bodyParser = require('body-parser');


const app = express()
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("db has been re sync")
// })

app.use('/', userRoutes)

app.listen(process.env.PORT, () => console.log(`Server is connected on ${process.env.PORT}`))
