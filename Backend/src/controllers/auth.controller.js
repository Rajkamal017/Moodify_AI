const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache")

async function registerUser(req, res){
    const { username, email, password } = req.body

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if(isAlreadyRegistered){
        return res.status(400).json({
            message: " User with the same email or username already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
        message: "user registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


async function loginUser(req,res){
    const { email, username, password } = req.body;

    if (!email && !username) {
        return res.status(400).json({
            message: "Email or username is required"
        })
    }

    const user = await userModel.findOne({
        $or: [
            {email},
            {username}
        ]
    }).select("+password")

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d"})

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function getMe(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "user fetched successfully",
        user
    })
}

async function logoutUser(req, res){
    const token = req.cookies.token

    res.clearCookie("token")

    await redis.set(token, Date.now().toString(), "EX", 60*60)

    await blacklistModel.create({ token })

    res.status(200).json({
        message: " Logout Successfully "
    })
}

async function googleAuth(req, res) {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: "Firebase ID Token is required" });
    }

    try {
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
            console.error("FIREBASE_API_KEY is not configured in backend environment variables.");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const verifyResponse = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyData.users || verifyData.users.length === 0) {
            return res.status(401).json({ message: "Invalid Google token" });
        }

        const googleUser = verifyData.users[0];
        const email = googleUser.email;
        const displayName = googleUser.displayName || email.split("@")[0];

        // Search for existing user
        let user = await userModel.findOne({ email });

        if (!user) {
            // Check if username is already taken. If so, append a random string or suffix
            let username = displayName.replace(/\s+/g, "").toLowerCase();
            const existingUsername = await userModel.findOne({ username });
            if (existingUsername) {
                username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
            }

            // Create a random secure password for social user
            const randomPassword = Math.random().toString(36).slice(-8) + Date.now().toString().slice(-4);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await userModel.create({
                username,
                email,
                password: hashedPassword
            });
        }

        // Generate JWT token
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Google sign-in successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Google Auth error:", error);
        return res.status(500).json({ message: "Internal Server Error during Google Auth" });
    }
}

/**
 * key value
 */


module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    googleAuth
}
