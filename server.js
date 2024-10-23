const express = require('express');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');

app.use(express.static('public'));
app.set('view engine', 'hbs');
const username = 'admin';
const password = 'admin@123';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(nocache());

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/homepage');
    } else {
        res.render('login', { msg: req.session.passwordwrong ? 'Invalid Credentials !' : '' });
        req.session.passwordwrong = false; // Reset the flag
    }
});

app.post('/verify', (req, res) => {
    console.log(req.body);

    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username;
        res.redirect('/homepage');
    } else {
        req.session.passwordwrong = true; // Set the flag for invalid credentials
        res.redirect('/'); // Redirect to the login page
    }
});

app.get('/homepage', (req, res) => {
    if (req.session.user) {
        res.render('homepage');
    } else {
        res.redirect('/'); // Redirect to login if not authenticated
    }
});
app.get('/logout', (req, res) => {
    if (req.session.user) { // Check if user is logged in
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/homepage'); // Redirect to homepage if there's an error
            }
            res.redirect('/'); // Redirect to login page
        });
    } else {
        res.redirect('/'); // Redirect to login page if not authenticated
    }
});


app.listen(3003, () => console.log('Server running at port 3003'));
