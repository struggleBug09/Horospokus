const express = require('express');
const cors = require('cors');
const app = express();
const { OpenAI } = require('openai');
require('dotenv').config();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


app.post('/horoscope', async (req, res) => {
    const { question, cards } = req.body;
  
    const cardList = cards.map(c => `${c.name}${c.reversed ? ' (Reversed)' : ''}`).join(', ');
  
    const prompt = `
      You are a tarot reader. A user asked: "${question}"
  They drew the following cards: ${cardList}
  Reference each drawn card on a separate paragraph each and have an explanation as to what that means for their question. Make sure you factor in the reversed cards. Also, make the reading as accurate as possible based on actual card reading meanings and their question.
  `;
  
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
  
      const reply = completion.choices[0].message.content;
      res.json({ result: reply });
    } catch (err) {
      console.error(err);
      res.status(500).json({ result: 'Error fetching reading.' });
    }
});
  


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
