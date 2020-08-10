import express, { NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

let token: any;
const csrfProtection = csrf({ cookie: true });

app.get('/', csrfProtection, (req, res) => {
    token = req.csrfToken()
    res.json(token);
})


app.post('/', function (req: express.Request, res: any, next: NextFunction) {
    if ((req.get('csrf-token')! !== token) && (req.body._csrf !== token)) {
        next(new Error('csrf-error'));
    }
    next();
}, (err: any, req: any, res: any, next: NextFunction) => {
    res.status(401).send('unauthorized');
}, function(req: any, res: any) {
    // console.log(req.headers);
    res.status(202).send('data is being processed');
});









// app.post('/login', (req: express.Request, res: express.Response, next: any) => {
//   const { username, password } = req.body;
//   if (`username: ${username}, password: ${password}` == 'username: yoonsung, password: 1234') {
//     res.json(token);
//   }
//   res.status(405).send('unauthorized');
// })

// app.get('/', (req: express.Request, res: express.Response, next: any) => {
//   if (req.get('Authorization') == 'Bearer dkdldndpdh') {
//     res.status(200).json('you are welcome');
//   } else {
//     res.status(401).end('error');
//   }
// })
