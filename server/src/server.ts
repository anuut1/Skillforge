import 'dotenv/config';
import app from './app';
import { startResumeQueueWorker } from './services/resumeWorker';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startResumeQueueWorker().catch(err => {
    console.warn('Worker initialization warning:', err.message);
  });
});
