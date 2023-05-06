import express, { json } from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import itemRoutes from "./routes/items.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer';

// create app
const app = express()

// cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// will allow us to send data to db
app.use(express.json())
app.use(cookieParser())

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        const newOriginalName = file.originalname.replace(/\s+/g, '');
        cb(null, Date.now()+newOriginalName)
    }
})
const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), function (req, res) {
    if (!req.file) {
        res.status(400).json('');
        return;
    }
    const file =  req.file;
    res.status(200).json(file.filename)
});

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/items", itemRoutes)

const port = 8000
app.listen(port, ()=>{
    console.log(`Connected! Listening on port ${port}`)
})