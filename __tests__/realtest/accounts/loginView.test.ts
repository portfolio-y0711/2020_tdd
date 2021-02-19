import 'should';
import supertest from 'supertest';
import session from 'express-session';
import express from 'express';
import { AccountRouter } from '../../../src/routers/accounts';

describe('LoginView', () => {
    const sinon = require('sinon');
    let request: any;
    const dummy_login_email = async () => { };
    const spy_login_with_user_if_there_is_one = sinon.spy();
    const fake_login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { token } = req.query;
        const user = await stub_authenticate(token);
        if (user) {
            spy_login_with_user_if_there_is_one();
            req.session!.email = user.email;
        }
        res.redirect('/');
    };
    const dummy_logout = () => {};
    const stub_authenticate = sinon.stub(require('../../../src/routers/accounts/service'), 'emailTokenAuthenticate');
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
        app.use('/', AccountRouter({ send_login_email: dummy_login_email, login: fake_login, logout: dummy_logout }));
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
                stub_authenticate.args[0][0].should.equal('abcd123');
                done();
            })
            .catch((e: any) => {
               done(e); 
            });
    });

    it('test_calls_auth_login_with_user_if_there_is_one', (done) => {
        spy_login_with_user_if_there_is_one.resetHistory();
        stub_authenticate.returns({ uuid: 'abcd123', email: 'whatever@mail.com', createdAt: Date.now() })
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                expect(spy_login_with_user_if_there_is_one.called).toBe(true);
                done();
            })
            .catch((e: any) => {
               done(e); 
            });

    });

    it('test_does_not_login_if_user_is_not_authenticated', (done) => {
        spy_login_with_user_if_there_is_one.resetHistory();
        stub_authenticate.returns(null);
        request
            .get('/accounts/login?token=abcd123')        
            .then(async (res: supertest.Response) => {
                expect(spy_login_with_user_if_there_is_one.called).toBe(false);
                done();
            })
            .catch((e: any) => {
               done(e); 
            });
    });
});