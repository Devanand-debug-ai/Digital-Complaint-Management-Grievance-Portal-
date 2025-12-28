import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev')); // Logger
app.use(bodyParser.json());

// Routes
import authRoutes from './routes/authRoutes';
import complaintRoutes from './routes/complaintRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

app.get('/', (req, res) => {
    res.send('Complaint Management API is running');
});

// Import and Sync DB
import { connectDB } from './config/database';
import { syncDB } from './models';

const startServer = async () => {
    await connectDB();
    await syncDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
