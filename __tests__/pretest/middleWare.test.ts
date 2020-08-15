import 'should';

import express from 'express';
import session from 'express-session'
import lusca from 'lusca';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'ssh, don\'t tell!',
    resave: false,
    saveUninitialized: true
}));
app.use(lusca({ csrf: true }));
app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).send([
        '<html>',
        '<body>',
        ` <input type="hidden" name="_csrf" value="${res.locals._csrf}"> `,
        '</body>',
        '</html>'
    ].join(''));
});
app.post('/csrfTest', function (req, res, next) {
    res.sendStatus(201);
});


const request = require('supertest-session')(app);

describe('middlewareTest', () => {
    describe('[GET /] will send you a form with csrfToken', () => {
        let token: string;
        beforeAll((done) => {
            request
                .get('/')
                .end((err: any, res: any) => {
                    const re = new RegExp(/"_csrf"\svalue="(.+)">/);
                    token = re.exec(res.text)![1];
                    done();
                })
        });

        describe('[POST /csrfTest] if you send a form WITH csrfToken', () => {
            it('will process your request', (done) => {
                request
                    .post('/csrfTest')
                    .type('form')
                    .send({ _csrf: token, item_text: '신규 아이템' })
                    .then((res: Response) => {
                        res.status.should.equal(201);
                        done();
                    }).catch((e: any) => {
                        done(e);
                    });
            })
        });

        describe('[POST /csrfTest] if you send a form WITHOUT csrfToken', () => {
            it('will not process your request', (done) => {
                request
                    .post('/csrfTest')
                    .type('form')
                    .send({ item_text: '신규 아이템' })
                    .then((res: Response) => {
                        res.status.should.equal(403);
                        done();
                    }).catch((e: any) => {
                        done(e);
                    });
            })
        });
    });
});