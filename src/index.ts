import express, { urlencoded } from 'express';
import { MustacheRenderer } from './views';

const app = express();


app.set('views', './src/views');
app.engine('mu', (filePath: any, options: any, callback: any) => {
    const rendered = MustacheRenderer.render(filePath, options);
    return callback(null, rendered);
});
app.set('view engine', 'mu');

app.get('/', (req: any, res: any) => {
    res.render('home', { title: 'To-Do lists from engine', name: 'world' });
});


app.listen(5000, () => {
    console.log('server is running at 5000');
});


