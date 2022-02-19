const passport = require('passport');
const User = require('../models/User');

module.exports.RegisterRender = (req, res) => {
    res.render("Users/Resgister");
}
module.exports.NewUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('Success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('Error', e.message);
        res.redirect('register');
    }
}

module.exports.LoginRender = (req, res) => {
    res.render('users/login');
}

module.exports.LoginCredentials = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    //.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}