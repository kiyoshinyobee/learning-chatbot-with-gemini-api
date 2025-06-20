const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// get the config env
dotenv.config()

// init express app
const mainApp = express();

// init express middleware
mainApp.use(cors());
mainApp.use(express.json());
mainApp.use(express.static('public'));

// init Gemini AI
const aiAgent = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = aiAgent.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

// running express app
const portApp = process.env.PORT;
mainApp.listen(portApp, () => {
  console.log(`Session 4 is running in PORT: ${portApp}`);
});

// API Route: handling chat
mainApp.post('/api/chat-service', async (req, res) => {
  const { inputMessage = '' } = req.body;
  if (!inputMessage) {
    return res.status(400).json({ response: 'Nothing message inputted.' });
  }

  try {
    const agentJob = await aiModel.generateContent(inputMessage);
    const agentResponse = await agentJob.response;
    res.json({ response: agentResponse.text() });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
});
