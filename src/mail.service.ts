import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envs = dotenv.parse(fs.readFileSync(path.join(__dirname + '../../.env')));

for (const k in envs) {
    process.env[k] = envs[k];
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  {
    pool: true,
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'portfolio.y0711@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret:  process.env.CLIENT_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
    //   expires: Date.now() + 86400000,
    //   refreshToken: process.env.REFRESH_TOKEN,
    //   accessUrl: process.env.TOKEN_URL
    //   type: 'OAuth2',
    //   user: 'portfolio.y0711@gmail.com',
    //   accessToken: process.env.ACCESS_TOKEN
    }
  },
  {
    from: 'To-Do Service <portfolio-y0711@gmail.com>'
  }
);

export const send_mail = (message: any) => {
  transporter.sendMail(message, (err: any, info: any) => {
    if (err) return console.log(err)
    console.log('Email sent: ', info)
  });
};

