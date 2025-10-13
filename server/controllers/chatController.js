import Chat from '../models/Chat.js'


//api to create a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatdata = {
            userId,
            messages: [],
            name: 'New Chat',
            userName: req.user.name,
        }

        await Chat.create(chatdata);
        res.json({ success: true, message: 'Chat created successfully' })
    
    } catch (error) {
        res.json({ success: false, message: error.message })
        
    }               
    
}

// api controller to get all chats
export const getChats = async (req, res) => {
    try {

        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.json({ success: true, message: 'Chats fetched successfully', chats })
    } catch (error) {
        res.json({ success: false, message: error.message })
        
    } 
}


//api controller for deleting a chat
export const deleteChat = async (req, res) => {

    try {
        const userId = req.user._id;
        const {chatId} = req.body;

        await Chat.deleteOne({ _id: chatId, userId });
        res.json({ success: true, message: 'Chat deleted successfully' })
        
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

