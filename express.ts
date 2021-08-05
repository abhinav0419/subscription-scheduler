import express from 'express';
import { json } from 'body-parser';
import { router } from './routes';
import cors from 'cors';
const corsOptions = {
    origin: '*',
}

export const app = express();

app.use(json());
app.use(express.static('files'));

app.use(cors(corsOptions))



app.use('/subscription-function', router);