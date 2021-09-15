import User from '../models/User.js';
import { registrationValidator, loginValidator } from '../helpers/validation.js'





export async function register(req, res) {
    try {
        const { error } = registrationValidator(req.body);
        if (error) {
            return res.status(400).json({message:error.details[0].message});
        }
        const user = await User.create(req.body);
        req.session.user = user
        res.json({message: 'User created successfully', data: user});
    } catch (error) {
        if ( error.code === 11000 ) {
            res.status(400).json({message:"Registration failed - check credentials. Maybe you already have an account?"})
        } else {
            res.status(500).json({message:error.details[0].message})
        }
    }
}
export async function login(req, res) {
    try {
        const { error } = loginValidator(req.body); 
        if (error) {
            return res.status(400).json({error});
        }
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({message: 'There was an error logging in. Please check your credentials.'});
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({message: 'There was an error logging in. Please check your credentials.'});
        }
        req.session.user = user
        res.json({message: 'User logged in successfully', data: user});
    } catch (error) {
        res.status(500).end();
    }
}
export async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({message:"Sorry about that. Maybe try again?"})
            }
            res.clearCookie('cookie.sid', { path: '/' }).json({message: "You've been logged out"})
        });
    } catch (error) {
        res.status(500).json({message:"Sorry about that. Maybe try again?"})
    }
}

export async function me(req, res) {
    //res.send(req.sessionID);
    if(req.session.user){
        //res.send(req.session.user);
        res.json({message: "you are in " , data:req.session.user});

    }else{
        res.json({message:"You are not logged in"})

    }
    

}


export async function checkSession(req, res) {
    if (!req.session) {
        return res.status(400).json({message: 'Your Session has expired , please log in again'});
    }else{
        res.send(req.session);
    }
    
}