import 'should';
import express from 'express';
import {
    Request,
    Response
} from 'express';

import { AccountRouter } from '../../src/routers/accounts';


describe('sendLoginEmailViewTest', () => {
    const sinon = require('sinon');
    let token: string;
    let request: any;
    const fake_send_mail = sinon.spy();
    const fakeTarget = {
        send_login_email: (req: Request, res: Response) => {
            fake_send_mail('subject', 'body', 'from_email', [req.body.email]);
            res.redirect('/');
        }
    };
    const spy_send_login_email = sinon.spy(fakeTarget, 'send_login_email');
    beforeAll(() => {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use('/', AccountRouter({ send_login_email: spy_send_login_email }));
        request = require('supertest-session')(app);
    });

    it('test_redirects_to_home_page', (done) => {
        request
            .post('/accounts/send_login_email')
            .type('form')
            .send({ email: 'yoonsung0711@gmail.com' })
            .then(async (res: Response) => {
                // (res.get('Location') as string).should.equal('/');
                res.get('Location').should.equal('/');
                spy_send_login_email.called.should.be.equal(true);
                fake_send_mail.args[0].should.deepEqual(['subject', 'body', 'from_email', ['yoonsung0711@gmail.com']]);
                res.status.should.equal(302);
                done();
            })
            .catch((e: any) => {
                done(e);
            });
    });
});