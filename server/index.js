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
  const { firstName, lastName, dob } = req.body;
  console.log('Received:', { firstName, lastName, dob });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Write a short, fun, daily horoscope for someone born on ${dob}.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const reply = completion.choices[0].message.content;
    res.json({ result: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: 'Error fetching horoscope.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
