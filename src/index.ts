import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { error, log } from 'console';
import router from './router';

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());

const server = http.createServer(app);



server.listen(8080, () => {
    console.log("Server running");
});

const MONGO_URL ='mongodb+srv://emailplayg1:XHrRmxI2DxGhQD87@brownsurveydb.ielidos.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error:Error) => console.log(error));

app.use('/', router());