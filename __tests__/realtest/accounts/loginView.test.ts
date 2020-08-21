import 'should';
import supertest from 'supertest';
import session from 'express-session';
import express from 'express';
import { AccountRouter } from '../../../src/routers/accounts';

describe('LoginView', () => {
    const sinon = require('sinon');
    let request: any;
    const dummy_login_email = async () => { };
    const fake_login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { token } = req.query;
        const user = await spy_authenticate(token);
        if (user) {
            req.session!.email = user.email;
        }
        res.redirect('/');
    };
    const spy_authenticate = sinon.spy(require('../../../src/routers/accounts/service'), 'authenticate');
    const real_authenticate = require('../../../src/routers/accounts/service').authenticate;
    beforeAll(() => {
        const app = express();
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            secret: 'kitcat',
            resave: false,
            saveUninitialized: true,
        }));
        app.use('/', AccountRouter({ send_login_email: dummy_login_email, login: fake_login }));
        request = require('supertest-session')(app);

    });

    it('test_redirects_to_home_page', (done) => {
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                res.get('Location').should.equal('/');
                res.status.should.equal(302);
                done();
            })
            .catch((e: any) => {
               done(e); 
            });
    });

    it('test_calls_authenticate_with_uid_from_get_request', (done) => {
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                spy_authenticate.args[0][0].should.equal('abcd123');
                done();
            })
            .catch((e: any) => {
               done(e); 
            });
    });

    it('test_calls_auth_login_with_user_if_there_is_one', (done) => {
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                done();
            })
            .catch((e: any) => {
               done(e); 
            });

    });

    it('test_does_not_login_if_user_is_not_authenticated', (done) => {
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                done();
            })
            .catch((e: any) => {
               done(e); 
            });
    });
});