import {db} from '../db.js'
import jwt from 'jsonwebtoken'

export const getItems = (req, res)=>{
    const query = req.query.cat
    ? "SELECT * FROM items WHERE cat=?" 
    : "SELECT * FROM items"
    // if category is specfied, only select those, otherwise selct all

    db.query(query, [req.query.cat], (err, data)=>{
        if(err) return res.status(200).send(err)

        return res.status(200).json(data)
    })
};


export const getItem = (req, res)=>{
    const query = "SELECT items.item_id, `username`, `title`, `desc`, users.img AS userImg, items.img as itemImg, `cat`, `last_updated` FROM `users` JOIN `items` ON `users`.`id`=`items`.`user_id` WHERE `items`.`item_id` = ?"

    db.query(query, [req.params.id], (err, data)=>{ // params is the :id in the url
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]); //returns array but we only need the first index: the item
    })
};


export const addItem = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const query = "INSERT INTO items (`title`, `desc`, `img`, `cat`, `last_updated`, `user_id`) VALUES (?)"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.last_updated,
            userInfo.id //from token
        ];

        console.log("Wrote this query: ")
        console.log(req.body.title)
        console.log(req.body.desc)
        console.log(req.body.img)
        console.log(req.body.cat)
        console.log(req.body.last_updated)
        console.log(userInfo.id)

        db.query(query, [values], (err, data)=>{
            if (err) return res.status(500).json(err);
    
            return res.json("Item has been created.");
        });
    });
};


export const deleteItem = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const itemID = req.params.id
        const query = "DELETE FROM items WHERE `item_id` = ? AND `user_id` = ?";

        db.query(query, [itemID, userInfo.id], (err, data)=>{
            if (err) return res.status(403).json(err);

            return res.json("Item has been deleted!");
        });
    });
};


export const updateItem = (req, res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenitcated!");
    
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const itemID = req.params.id
        const query = "UPDATE items SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `item_id`=? AND `user_id`=?"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ];

        db.query(query, [...values, itemID, userInfo.id], (err, data)=>{
            if (err) return res.status(500).json(err);
    
            return res.json("Item information has been updated.");
        });
    });
};