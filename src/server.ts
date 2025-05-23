import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import accountRoutes from './routes/accountRoutes';


const app = express();

const PORT = process.env.PORT || 5000;
dotenv.config();

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

    
app.use(express.json())
app.use('/api/v1', accountRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
