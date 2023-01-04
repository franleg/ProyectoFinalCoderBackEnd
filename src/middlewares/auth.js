// MIDDLEWARE OF PUBLIC VALIDATION
const publicValidation = (req, res, next) => {
    try {
        const user = req.session.user;
        if(user) return res.redirect('/');
        else next();
    } catch (error) {
        console.log(error);
    }
}

// MIDDLEWARE OF PRIVATE VALIDATION 
const privateValidation = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) return res.redirect('/login');
        next();
    } catch (error) {
        console.log(error);
    }
}

// MIDDLEWARE OF EXECUTE POLICIES
const executePolicies = (policies) => {
    return (req, res, next) => {
        if(policies[0].toUpperCase() === "PUBLIC") return next();
        if(policies.includes(req.session.user.role.toUpperCase())) return next();
        res.redirect('/'); 
    }
}

export default { 
    publicValidation,
    privateValidation,
    executePolicies
};