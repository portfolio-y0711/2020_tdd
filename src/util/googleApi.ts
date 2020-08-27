import dotenv from 'dotenv';
import { google } from 'googleapis';
import { Oauth } from '../../src/models/oauth.entity';
import { getRepository } from 'typeorm';

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = [
    'https://mail.google.com'
];

export const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

oauth2Client.on('tokens', async (tokens) => {
    const repo = getRepository(Oauth);
    const oauth = await repo.findOne('gmail_oauth');

    if (oauth) {
        oauth.access_token = tokens.access_token!;
        await repo.update(
            { service_name: 'gmail_oauth' },
            { access_token: tokens.access_token! }
        );
    } else {
        oauth2Client.setCredentials({
            refresh_token: tokens.refresh_token
        });
        await repo.save({
            service_name: 'gmail_oauth',
            access_token: tokens.access_token!,
            refresh_token: tokens.refresh_token!,
        });
    }
});

export const getToken = async (code: any) => {
    const { tokens } = await oauth2Client.getToken(code);
};
