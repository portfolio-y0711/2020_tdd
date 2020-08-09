import express from 'express';
import { resolve } from './util';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import { home_page, MustacheRenderer } from './views';

const app = express();


// app.set('views', './src/views');
// app.engine('mu', (filePath: any, options: any, callback: any) => {
//     const rendered = MustacheRenderer.render(filePath, options);
//     return callback(null, rendered);
// });
// app.set('view engine', 'mu');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, (req: any, res: any) => {
    const result = resolve('/')({ csrfToken: req.csrfToken() });
    res.send(result);
});

router.post('/', csrfProtection, (req: express.Request, res: any) => {
    const result = resolve('/')(Object.assign({}, req.body, { csrfToken: req.csrfToken() }));
    console.log(Object.assign({}, req.body, { csrfToken: req.csrfToken() }));
    res.send(result);
});

// router.get('/form', csrfProtection, (req: any, res: any) => {
    // const result = resolve('/')();
    // res.send(result, { scrfToken: req.csrfToken() });
    // res.render('send', { csrfToken: req.csrfToken() })
//     res.render('send', { csrfToken: req.csrfToken() })
// });


app.use('/', router);

app.listen(5000, () => {
    console.log('server is running at 5000');
});


