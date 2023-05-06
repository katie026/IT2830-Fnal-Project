import {db} from '../db.js'
import jwt from 'jsonwebtoken'

export const getPosts = (req, res)=>{
    const query = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?" 
    : "SELECT * FROM posts"
    // if category is specfied, only select those, otherwise selct all

    db.query(query, [req.query.cat], (err, data)=>{
        if(err) return res.status(200).send(err)

        return res.status(200).json(data)
    })
};


export const getPost = (req, res)=>{
    const query = "SELECT posts.post_id, `username`, `title`, `desc`, users.img AS userImg, posts.img as postImg, `cat`, `date` FROM `users` JOIN `posts` ON `users`.`id`=`posts`.`user_id` WHERE `posts`.`post_id` = ?"

    db.query(query, [req.params.id], (err, data)=>{ // params is the :id in the url
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]); //returns array but we only need the first item: the post
    })
};


export const addPost = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const query = "INSERT INTO posts (`title`, `desc`, `img`, `cat`, `date`, `user_id`) VALUES (?)"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id //from token
        ];

        db.query(query, [values], (err, data)=>{
            if (err) return res.status(500).json(err);
    
            return res.json("Post has been created.");
        });
    });
};


export const deletePost = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const postID = req.params.id
        const query = "DELETE FROM posts WHERE `post_id` = ? AND `user_id` = ?";

        db.query(query, [postID, userInfo.id], (err, data)=>{
            if (err) return res.status(403).json("You can only delete your own post!");

            return res.json("Post has been deleted!");
        });
    });
};


export const updatePost = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const postId = req.params.id
        const query = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `post_id`=? AND `user_id`=?"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ];

        db.query(query, [...values, postId, userInfo.id], (err, data)=>{
            if (err) return res.status(500).json(err);
    
            return res.json("Post has been updated.");
        });
    });
};