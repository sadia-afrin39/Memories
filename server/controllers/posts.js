import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) =>{
    try{
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message })  ;  
    }
}

export const createPost = async (req, res) =>{
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date()});
    // console.log(post)
    // console.log(newPost)
    try{
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message })  ;  
    }
}

export const updatePost = async (req, res) =>{     //icon only visible to its owner(handled by frontend)
    const {id: _id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true} );
    res.json(updatedPost);
}

export const deletePost = async (req, res) =>{      //icon only visible to its owner(handled by frontend)
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await PostMessage.findByIdAndRemove(_id);
    res.json({message: 'Post Deleted Successfully!'});
}

export const likePost = async (req, res) =>{
    const {id: _id} = req.params;

    if(!req.userId) return res.json({ message: 'Authentication error!' });  
      
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((_id)=> _id === String(req.userId));
    if(index === -1){
        //like the post
        post.likes.push(req.userId);
    }else{
        //dislike the post
        post.likes = post.likes.filter((_id)=> _id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true} );
    res.json(updatedPost);
}