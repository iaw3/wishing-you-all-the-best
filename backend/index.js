const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const http = require('http');
// const socketIo = require('socket.io');

const Message = require("./messageSchema");

const app = express();

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());


app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.status(200).json(messages);
});

app.post('/message', async (req, res) => {
    const messageText = req.body.message;
    const newMessage = new Message({message: messageText});
    await newMessage.save();

    // io.emit('new message', newMessage);

    res.status(201).send({result:'success'});
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  },
});

app.post('/email', (req, res) => {
    const fromName = req.body.from;
    const toName = req.body.to;
    const toEmail = req.body.email;
    const text = req.body.message;

    const textFormat = `dear ${toName},\n\n${text}\n\nwishing you all the best,\n${fromName}`
    const mailOptions = {
        from: 'w1sh1ng.u.4ll.the.b3st@gmail.com',  
        to: toEmail,  
        subject: '',  
        text: textFormat,  
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
    });    
})

// OgLrN8fD9QHSeYCo
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected successfully via Mongoose'))
.catch(err => {
console.error('Error connecting to MongoDB:', err);
process.exit(1); 
});

// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.emit('connection', { message: 'You are connected!' });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
