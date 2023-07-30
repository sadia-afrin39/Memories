import express from "express";

import {getPostsBySearch, getPosts,createPost,updatePost,deletePost,likePost } from "../controllers/posts.js";
import auth from '../middleware/auth.js';

const router = express.Router();

//localhost:5000/posts
router.get('/', getPosts);
router.get('/search', getPostsBySearch);
router.post('/', auth, createPost);
router.patch('/:id',auth, updatePost);   //icon only visible to its owner(handled by frontend), auth not required 
router.delete('/:id', auth,deletePost);   //icon only visible to its owner(handled by frontend) auth not required
router.patch('/:id/likePost', auth,likePost);

export default router;