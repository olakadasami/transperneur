const express = require('express');
const dotenv = require('dotenv').config();
const ejs = require('ejs')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const mongoDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();
const port = process.env.PORT || 4001;

// connecting mongodb
mongoDB();

// setting view
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser())


// routes
app.get('*', checkUser)

app.get('/', (req, res) => {
    res.render('home', {title:"Home"})
})

app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', {
        title: "Dashboard"
    })
})

// user routing
app.use('/users', userRoutes)

app.listen(port, () => {
    console.log(`listening for requests on port ${port}`)
})
