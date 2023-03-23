const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const rfs = require('rotating-file-stream');
const {isEmail} = require('validator');
const { mailer } = require('./email');

const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
if (process.env.NODE_ENV === 'production'){
    // create a write stream for logging to file
    app.use(morgan('dev'));
}else {
    app.use(morgan("combined",{ stream: accessLogStream }));
}

app.get('/', (req, res)=>{
    return res.send(' <h1>Welcome to Spirit Mailer</h1> \n <p>created by Seun Daniel Omatsola</p> ')
})

app.post('/send-email', (req, res)=>{
    try {
        const { recievingEmail, message, senderEmail, password, subject }= req.body;


        if(!isEmail(recievingEmail) || !isEmail(senderEmail)){
            return res.status(400).json({
                success: false,
                message: 'one of the emails provided is incorrect',
            })
        }
        mailer(recievingEmail, message, senderEmail, password, subject);
            return res.status(200).json({
                success: true,
                message: 'email successfuly sent'
            })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occured, we are working on it',
            error: error.message
        });
    }
});

app.use((req, res, next)=>{
    next(new Error(message = "Route Not found"));
});

app.use((error, req, res, next)=>{
    return res.status(404).json({
        status: 'failed',
        message: error.message
    });
});
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log('CTRL+C to exit.');
});
app.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            app.listen(port);
        }, 1000);
    }
});
