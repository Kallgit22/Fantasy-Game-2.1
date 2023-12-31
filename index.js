const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
    path:"./config.env",
})
const port = process.env.PORT || 2000;
const uri = process.env.DATABASE_URL;
const app = express();
app.use(express.urlencoded({ extended: true }));
mongoose.connect(uri)
    .then(function () { console.log("MongoDB Connected") })
    .catch(function (err) { console.log("Mongo error", err) });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });
const user = mongoose.model('user', userSchema);



app.post('/registerUser', function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    const users = user.create({
        name: name,
        email: email,
        password: password

    });
    if (users.length!=0) {
        res.send(JSON.parse('[{"status":"Success","message":"User Registered Successfully"}]'));
    } else {
        res.send(JSON.parse('[{"status":"Failed","message":"User Registeration Failed"}]'));
    }

});

app.post('/getUser', async function (req, res) {
    let email = req.body.email;
    
    const userdata = await user.find({email:email});
    res.send(userdata);
});

app.post('/authUser', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if (email != null && password != null) {
        const userdata = await user.find({ email:email,password:password});
        if(userdata.length===0){
            res.send(JSON.parse('[{"status":"Failed","message":"Invali Email or Password"}]'));
        }else{
            res.send(JSON.parse('[{"status":"Success","message":"Login successfully"}]'));
        }
    } else {
        res.send(JSON.parse('[{"status":"Failed","message":"Network Error"}]'))
    }
});

app.post('/getOTP', function (req, res) {

    let email = req.body.email;
    let OTP = Math.floor(Math.random() * 9000 + 1000);
    const html = `<p>Your OTP is : 8989</p>`
    async function Main() {
      const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure:true,
        auth: {
          user: 'contact@agamyatech.in',
          pass: 'Kall@1234'
        }

      });

      const MailOption = {
        from: "contact@agamyatech.in",
        to: `${email}`,
        subject: "Fantasy Game",
        html:`Your Otp is : ${OTP}`,
      };

      const info = await transporter.sendMail(MailOption);
      res.send(JSON.parse(`[{"status":"Success","message":"Email Sent","OTP":"${OTP}"}]`));
    }
    Main().catch(e=>console.log(e));
  });

app.listen(port || 7000, () => { console.log(`Listning on PORT : ${port},${uri}`) });