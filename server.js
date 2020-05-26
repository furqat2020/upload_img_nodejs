const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')

const Port = 4321

//set storage engine
const storage = multer.diskStorage(
    {
        destination: './public/rasm/',
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }
)

// init upload
var upload = multer(
    {
        storage: storage,
        limits: {fileSize: 1024*1024*50},
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb)
        }
    }
).single('fayl')

//check file type
checkFileType = (file, cb) => {
    const filetype = /jpeg|jpg|gif|png/
    const extname = filetype.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = filetype.test(file.mimetype)

    if(extname && mimetype){
        return cb(null, true)
    }else{
        cb("Error: Faqat rasm kengaytmasi...")
    }
}

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/uploaded', (req, res) => {
    upload(req, res, err => {
        if(err){
            res.render('index', {msg: err})
        }else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: Fayl tanlanmadi...',
                })
            }else{
                res.render('index', {
                    msg: "Fayl yuklandi...",
                    fayl: `rasm/${req.file.originalname}`
                })
            }
        }
    })
})

app.listen(Port, () => {
    console.log("Server ishga tushdi. PORT = " + Port)
})
