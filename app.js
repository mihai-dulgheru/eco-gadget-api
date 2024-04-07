import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import { connect } from './functions';
import { errorHandler } from './middleware';
import { tanksRouter } from './routes';

const app = express();

connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/tanks', tanksRouter);

app.use(errorHandler);

export default app;
