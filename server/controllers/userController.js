import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'



dotenv.config()

// generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}



//api to register a user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email })

        if(userExists){
            return res.json({ success: false, message: 'User already exists' })
        } 
    const user = await User.create({ name, email, password })

    const token = generateToken(user._id)

    res.json({ success: true, message: 'User registered successfully', token })
    
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

//api to login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if(user){
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
                const token = generateToken(user._id);
                return res.json({ success: true, token })
            }
        }
        return res.json({ success: false, message: 'invalid credentials' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//api to get user details
export const getUser = async (req, res) => {
    try { 
        
        const user = req.user;
        return res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
        
    }
}


//api to get PUBLISHED IMAGES
export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            {
                $unwind: '$messages'
            },
            {
                $match: { 'messages.isImage': true, 'messages.isPublished': true }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: '$messages.content',
                    userName: '$userName'
                }
            }
        ])

        res.json({ success: true, images: publishedImageMessages.reverse() })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}