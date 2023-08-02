import express from "express";

import {getPostsBySearch, getPost, getPosts,createPost,updatePost,deletePost,likePost,commentPost } from "../controllers/posts.js";
import auth from '../middleware/auth.js';

const router = express.Router();

//localhost:5000/posts
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/search', getPostsBySearch);

router.post('/', auth, createPost);
router.patch('/:id',auth, updatePost);   //icon only visible to its owner(handled by frontend), auth not required 
router.delete('/:id', auth,deletePost);   //icon only visible to its owner(handled by frontend) auth not required
router.patch('/:id/likePost', auth,likePost);
router.post('/:id/commentPost', auth,commentPost);

export default router;