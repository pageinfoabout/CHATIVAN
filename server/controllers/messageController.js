import Chat from '../models/Chat.js'
import User from '../models/User.js'

import imagekit from '../configs/imagekit.js'
import openai from '../configs/openai.js'

const MEMORY_WINDOW = Number(process.env.CHAT_MEMORY_WINDOW || 10) // 5–10 is typical

//text-based message
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        //check credits
        if(req.user.credits < 1) {
            return res.json({ success: false, message: 'Insufficient credits' })
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ _id: chatId, userId });
        chat.messages.push({
          role: "user", 
          content: prompt, 
          timestamp: Date.now(), 
          isImage: false})
        
        const history = chat.messages
        .filter(m => m.role === 'user')
        .slice(-MEMORY_WINDOW)
        .map(m => ({role: m.role, content: m.content}))

    
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          },
          ...history
        ],
      });
      console.log(completion);
      console.log(completion?.choices?.[0]?.message?.content);
      

      
     
    

    const content = completion?.choices?.[0]?.message?.content ?? 'Sorry, I have no response.';
    const reply = { role: 'assistant', content, timestamp: Date.now(), isImage: false };
      res.json({success: true, message: 'Message sent successfully', reply})

      chat.messages.push(reply)
      await chat.save()

      await User.updateOne({_id: userId}, {$inc: {credits: -1}})
      
      
        
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}


//image-generation controller

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    //check credits
    if(req.user.credits < 2) {
      return res.json({ success: false, message: 'Insufficient credits' })
    }

    const { chatId, prompt, isPublished } = req.body;
    console.log(prompt);
    

    //find chat
    const chat = await Chat.findOne({ _id: chatId, userId });
    console.log(chat);

    //Push user message to chat
    chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });
    console.log(chat.messages);

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash-image-preview',
      messages: [
        {
          role: 'user',
          content: prompt
        },
      ],
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: '3:4',
      },
    });
    console.log(completion);

    const msg = completion?.choices?.[0]?.message;
    const dataUrl = msg?.images?.[0]?.image_url?.url || ''; // e.g. "data:image/png;base64,AAA..."
    let imageUrl = '';
    
    if (dataUrl.startsWith('data:image/')) {
      const b64 = dataUrl.split(',')[1] || '';
      const upload = await imagekit.upload({
        file: b64, // raw base64 (no "data:" prefix)
        fileName: `${Date.now()}.png`,
        folder: 'generated-images',
      });
      imageUrl = upload.url;
    } else if (dataUrl) {
      imageUrl = dataUrl; // if provider already gave an http(s) url
    }
    
    const publish = isPublished === true || isPublished === 'true';
    if (!imageUrl) return res.json({ success: false, message: 'Model returned no image' });
    
    const reply = {
      role: 'assistant',
      content: imageUrl,
      timestamp: Date.now(),
      isImage: true,
      isPublished: publish,
    };
    
    res.json({ success: true, message: 'Image generated successfully', reply });
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}