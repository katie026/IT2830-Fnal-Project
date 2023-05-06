import {db} from "../db.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res)=>{
    // CHECK EXISTING USER
    const checkQuery = "SELECT * FROM users WHERE username = ?"

    db.query(checkQuery,[req.body.username], (err, data)=>{
        if(err) return res.json(err);
        if (data.length) return res.status(409).json("User already exists!") //data already exists

        // HASH THE PASSWORD AND CREATE USER
        const salt = bcrypt.genSaltSync(10); // encryption setting
        const hash = bcrypt.hashSync(req.body.password, salt);

        const createQuery = "INSERT INTO users (`first_name`, `last_name`, `username`, `password`) VALUES (?)"
        const values = [req.body.first_name, req.body.last_name, req.body.username, hash];

        db.query(createQuery, [values], (err, data)=>{
            if(err) return res.json(err);  
            return res.status(200).json("User has been created.");
        })
    })
}

export const login = (req, res)=>{
    // CHECK USER
    const checkQuery = "SELECT * FROM users WHERE username = ?"
    db.query(checkQuery,[req.body.username], (err, data)=>{
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json("User not found!") // username not in db

    // CHECK PASSWORD
    const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
    ); // data[0] is our user, so we compare the stored password

    if (!isPasswordCorrect) 
        return res.status(400).json("Wrong username or password!");
    
        const token = jwt.sign({id:data[0].id}, "jwtkey");
        // it should send user information that identifies user (like user_id), storing token in cookie
        const { password, ...other } = data[0] // so we can send everything except the hashed password to api
        
        res.cookie("access_token", token, { //the hashed token equals user_id
            httpOnly: true // scripts in browser cannot reach cookie directly, we'll only use it when we make API requests
        }).status(200).json(other)
    });
}

// export const logout = (req, res)=>{
//     console.log("logout has been attempted")
//     res.clearCookie("access_token", {
//         sameSite: "none",
//         secure: true
//     }).status(200).json("User has been logged out.")
// }

export const logout = (req, res)=>{
    console.log("logout has been attempted")
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    });
    console.log(res);
    return res.status(200).json("User has been logged out.");
}
