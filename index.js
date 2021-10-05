import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo'


import connectToDatabase from './models/index.js';
import { userRoutes} from './routes/index.js';


dotenv.config();
const port = process.env.PORT || 5000;
//const port = process.env.PORT || 8888;


const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, path: '/' },
    // cookie: {httpOnly: false},
    key: 'cookie.sid',
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
/*app.use(cors({
    credentials: true,
    origin: ['https://www.s4b-consulting.de/' , 'http://localhost:3000']

}))*/


app.use("/users", userRoutes)




connectToDatabase().then((error) => {
    if (error) {
        console.log(error)
        return process.exit(1)
    }
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port http://localhost:${port}`)
    })
})