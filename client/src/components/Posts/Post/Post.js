import React,{useState} from 'react';
import {Card, CardActions, CardContent, CardMedia, Button, Typography,ButtonBase} from '@material-ui/core';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import MorehorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import useStyles from './styles';
import {deletePost,likePost } from '../../../actions/posts';

const Post = ( {post, setcurrentId} ) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [likes,setLikes] = useState(post?.likes);
    const userId = user?.result?.googleId || user?.result?._id;
    const hasLikedPost= likes.find((like) => like === userId);

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if(hasLikedPost){
            setLikes(likes.filter((id)=> id !== userId));
        }else{
            setLikes([...likes,userId]);
        }
    }

    const Likes = () => {
        if (likes?.length > 0) {
          return hasLikedPost
            ? (
              <><ThumbUpIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpOffAltIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
     
         return <div><ThumbUpOffAltIcon fontSize="small" />&nbsp;Like</div>;     
    };

    const openPost = () => navigate(`/posts/${post._id}`);

    return(
        <Card className= {classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className= {classes.media} image= {post.selectedFile} title= {post.title} />
                <div className= {classes.overlay}>
                    <Typography variant='h6'> {post.name} </Typography>
                    <Typography variant='body2'> {moment(post.createdAt).fromNow()} </Typography>  
                </div>

                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <div className= {classes.overlay2}>
                        <Button style= {{color: 'white'}} size="small" onClick={() => setcurrentId(post._id) } >
                            <MorehorizIcon fontSize='default' />
                        </Button>
                    </div>
                )}
                
                <div className= {classes.details}>
                    <Typography variant='body2' color="textSecondary"> {post.tags.map((tag) => `#${tag} `)} </Typography>
                </div>
                <Typography className= {classes.title} variant='h5' gutterBottom> {post.title}</Typography>
                <CardContent>
                    <Typography variant='body2' color="textSecondary" component="p" gutterBottom> {post.message}</Typography>
                </CardContent>
            </ButtonBase>
            
            <CardActions className= {classes.cardActions}>
                <Button color= "primary" size="small" disabled={!user?.result} onClick={handleLike } >
                    <Likes/> 
                </Button>

                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button color= "primary" size="small" onClick={() => dispatch(deletePost(post._id)) } >
                    <DeleteIcon fontSize='small' />
                    &nbsp; Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;