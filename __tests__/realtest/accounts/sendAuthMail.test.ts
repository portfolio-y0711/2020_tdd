import 'should';
import express from 'express';
import supertest from 'supertest';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { AccountRouter } from '../../../src/routers/accounts';
import { Token } from '../../../src/models/token.entity';
import { getRepository } from 'typeorm';
import { APP } from '../../../src/app';

describe('Spy + Fake test for sendLoginEmailView', () => {
    const sinon = require('sinon');
    let request: any;
    const fake_send_mail = sinon.spy();
    const fakeTarget = {
        send_login_email: (req: express.Request, res: express.Response) => {
            fake_send_mail('subject', 'body', 'from_email', [req.body.email]);
            res.setHeader('message', 'Check your email, we\'ve sent you a link you can use to log in!');
            res.redirect('/');
        }
    };
    const spy_send_login_email = sinon.spy(fakeTarget, 'send_login_email');
    const dummy_login = async () => {};

    beforeAll(() => {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            secret: 'kitcat',
            resave: false,
            saveUninitialized: true,
        }));
        app.use('/', AccountRouter({ send_login_email: spy_send_login_email, login: dummy_login }));
        request = require('supertest-session')(app);
    });

    it('test_redirects_to_home_page', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                res.get('Location').should.equal('/');
                res.status.should.equal(302);
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });

    it('test_adds_success_message', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                const expected = 'Check your email, we\'ve sent you a link you can use to log in!'
                const received: string = (JSON.parse(JSON.stringify(res.header)).message);
                received.should.equal(expected);
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });

    it('test_sends_mail_to_address_from_post', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                spy_send_login_email.called.should.be.equal(true);
                fake_send_mail.args[0].should.deepEqual(['subject', 'body', 'from_email', ['yoonsung0711@gmail.com']]);
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });

});

describe('Spy + Real app test for sendLoginEmailView', () => {
    const real_app = APP.init().getApp();
    const request = require('supertest-session')(real_app);

    let token: string;
    beforeAll((done) => {
        request
            .get('/')
            .end((err: any, res: any) => {
                const re = new RegExp(/"_csrf"\s+value="(.+)">/);
                token = re.exec(res.text)![1];
                done();
            })
    });

    it('test_creates_token_associated_with_email', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ _csrf: token, email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                const token = (await getRepository(Token).find())[0];
                token.email.should.equal('yoonsung0711@gmail.com');
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });

    it('test_sends_link_to_login_using_token_uuid', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                const token = (await getRepository(Token).find())[0];
                token.email.should.equal('yoonsung0711@gmail.com');
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });
});

describe('Spy test for sendLoginEmailView', () => {
    const sinon = require('sinon');
    const spy_send_mail = sinon.spy(require('../../../src/util/nodemailer'), 'send_mail');
    const dummy_login = async () => {};
    let request: any;


    const spy_send_login_email = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { email } = req.body;
        const uid = uuid().toString();
        await getRepository(Token).save({ email: email, uuid: uid });
        const url = `http://localhost:5000/accounts/login?token=${uid}`;
        const message_body = `Use this link to log in: ${url}`;
        spy_send_mail(
            'Your login link for Superlists',
            `${message_body}`,
            'noreply@superlists',
            `${email}`
        );
        res.setHeader('message', 'Check your email, we\'ve sent you a link you can use to log in!');
        res.redirect('/');
    };

    beforeAll(() => {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            secret: 'kitcat',
            resave: false,
            saveUninitialized: true,
        }));
        app.use('/', AccountRouter({ send_login_email: spy_send_login_email, login: dummy_login }));
        request = require('supertest-session')(app);
    });

    it('test_sends_link_to_login_using_token_uuid', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: supertest.Response) => {
                const tokens = (await getRepository(Token).find({ order: { createdAt: 'ASC' }}));
                const token = tokens[0];
                const expected_url = `http://localhost:5000/accounts/login?token=${token.uuid}`;
                const isContained = (spy_send_mail.args[0] as string[]).some(arg => {/* console.log(arg);console.log(arg.includes(expected_url));*/ return arg.includes(expected_url)});
                expect(isContained).toBe(true);
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });
});