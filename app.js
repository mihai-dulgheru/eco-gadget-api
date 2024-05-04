import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import { errorHandler } from './middleware';
import {
  accountsRouter,
  recyclingInfoRouter,
  recyclingLocationsRouter,
} from './routes';
import { connect } from './utils';

const app = express();

connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/accounts', accountsRouter);
app.use('/recycling-info', recyclingInfoRouter);
app.use('/recycling-locations', recyclingLocationsRouter);

app.use(errorHandler);

export default app;
