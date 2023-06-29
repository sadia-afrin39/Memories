import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';  //CORS allows servers to specify which origins (domains, protocols, and ports) are allowed to make requests to their resources.
import postRoutes from './routes/posts.js';

const app = express();

app.use('/posts',postRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({  limit:"30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = "mongodb+srv://SadiaAfrin:12345Tarin@cluster0.3lchog8.mongodb.net/train";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT ,()=> console.log(`Server is listening to port: ${PORT}`)))
.catch((err) => console.log(err.message));

//mongoose.set('useFindAndModify', false);