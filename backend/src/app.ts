import express from 'express';
import cors from 'cors';
import featuresRouter from './routes/features';
import recordingsRouter from './routes/recordings';
import reviewsRouter from './routes/reviews';
import statsRouter from './routes/stats';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/features', featuresRouter);
app.use('/api/recordings', recordingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/stats', statsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'demo-studio-backend' });
});

export default app;
