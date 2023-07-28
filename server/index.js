import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';  //CORS allows servers to specify which origins (domains, protocols, and ports) are allowed to make requests to their resources.
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({  limit:"30mb", extended: true }));
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); 
//     next();
//   });

app.use('/posts',postRoutes);
app.use('/user',userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT ,()=> console.log(`Server is listening to port: ${PORT}`)))
.catch((err) => console.log(err.message));

//mongoose.set('useFindAndModify', false);