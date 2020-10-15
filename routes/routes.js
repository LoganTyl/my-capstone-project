// Redirects to sign in page if root page is called
exports.root = (req,res) => {
    res.redirect('/signIn')
};

// Get page for signing in
exports.signIn = (req,res) => {
    res.render('signIn', {
        title: "Sign In"
    })
}

// Get page for signing up
exports.signUp = (req,res) => {
    res.render('signUp', {
        title: "Create An Account"
    })
}