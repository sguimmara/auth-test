import auth from './auth.js';
import express from 'express';
import log from './log.js';
import ejs from 'ejs';
import path from 'path';

const app = express();

const port = 3000;

auth.init();

app.engine('.html', ejs.__express);
app.set('views', path.join('.', 'src' , 'views'));
app.use(express.static(path.join('.', 'public')));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.listen(port, () => {
    log.info(`starting on port ${port}`);
});

