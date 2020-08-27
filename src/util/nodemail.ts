import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Oauth } from '../models/oauth.entity';
import { createTransport } from 'nodemailer';
import { getRepository } from "typeorm";

const envs = dotenv.parse(fs.readFileSync(path.join(__dirname + '../../../.env')));

for (const k in envs) {
  process.env[k] = envs[k];
}

export const mailer = (() => {
  const send_mail = async (subject: any, message: any, from_email: any, to_email: any) => {
    const repo = getRepository(Oauth);
    const oauth = await repo.findOne('gmail_oauth');
    getTransporter(oauth!).sendMail({
      from: from_email,
      to: to_email,
      subject: subject,
      text: message
    });
  };
  const getTransporter = (oauth: Oauth) => createTransport(
    {
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_ACCOUNT,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: oauth.access_token,
        expires: Date.now() + 10000,
      }
    },
    {
      from: 'To-Do Service <portfolio-y0711@gmail.com>'
    }
  );
  return {
    send_mail
  };
})();
