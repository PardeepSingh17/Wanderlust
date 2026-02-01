const User = require("../models/user.js")

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res , next) => {
    try{
        let {username , email, password} = req.body
        let newUser = new User({
            username : username ,
            email : email
        })

        await User.register(newUser, password)
        req.login(newUser, (err) => {
            if(err){
                next(err)
            } else{
                req.flash("success", "Welcome to wanderlust")
                res.redirect("/listing")
            }
        })
        
    } catch(e) {
        req.flash("error" , e.message)
        res.redirect("/user/signup")
    }
    
}

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!")
    let redirectURL = res.locals.redirectURL || "/listing"
    res.redirect(redirectURL)
    
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err)
        }else {
            req.flash("success", "You're logged out successfully!")
            res.redirect("/listing")
        }
    })
}