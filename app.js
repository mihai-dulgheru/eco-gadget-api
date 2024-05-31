import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import { errorHandler } from './middleware';
import {
  accountsRouter,
  applianceRoutes,
  messagesRouter,
  recyclingInfoRouter,
  recyclingLocationsRouter,
  recyclingManagerRouter,
  usersRouter,
} from './routes';
import { connect } from './utils';

const app = express();

connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use('/accounts', accountsRouter);
app.use('/appliances', applianceRoutes);
app.use('/messages', messagesRouter);
app.use('/recycling-info', recyclingInfoRouter);
app.use('/recycling-locations', recyclingLocationsRouter);
app.use('/recycling-manager', recyclingManagerRouter);
app.use('/users', usersRouter);

app.use(errorHandler);

export default app;
