import express from 'express';
import { resolve } from './util';
import { home_page, MustacheRenderer } from './views';

const app = express();


// app.set('views', './src/views');
// app.engine('mu', (filePath: any, options: any, callback: any) => {
//     const rendered = MustacheRenderer.render(filePath, options);
//     return callback(null, rendered);
// });
// app.set('view engine', 'mu');

const router = express.Router();

router.get('/', (req: any, res: any) => {
    const result = resolve('/')();
    res.send(result);
});


app.use('/', router);

app.listen(5000, () => {
    console.log('server is running at 5000');
});


