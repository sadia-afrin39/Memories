import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPostsBySearch =  async (req,res) =>{
    const {searchQuery, tags} = req.query;
    try{
        const title = new RegExp(searchQuery, 'i');
        //console.log(title);
        const posts = await PostMessage.find({$or : [{title},{message:title},{name: title},{tags: {$in: tags.split(',') }} ] });
        res.status(200).json({data:posts});
    }catch(error){
        res.status(404).json({ message: error.message })  ;  
    }
}

export const getPosts = async (req, res) =>{ 
    const {page} = req.query;
    try{
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; 
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/ LIMIT)});

    } catch (error) {
        res.status(404).json({ message: error.message })  ;  
    }
}

export const getPost = async (req, res) =>{
    const {id} = req.params;
    try{
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
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

export const commentPost = async (req, res) =>{
    const {id: _id} = req.params;
    const {value} = req.body;

     const post = await PostMessage.findById(_id);

   post.comments.push(value);
   const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true} );
   res.json(updatePost);
}