import "dotenv/config"
import OpenAi from "openai"
import express from "express"
import cors from "cors"
import { ORACLE_SYSTEM } from "./prompts.js"

const app = express()
app.use(cors())
app.use(express.json())


const llm = new OpenAi({
  baseURL: process.env.LLM_BASE_URL,
  apiKey: process.env.LLM_API_KEY,
})

const parseJson = (raw) => JSON.parse(raw.replace(/```json|```/g, '').trim());

app.post("/api/oracle", async (req, res) => {
  const { message, solution = "", history = [], playerFacts = [], corruption = 0 } = req.body

  try {
    const completion = await llm.chat.completions.create({
      model: process.env.LLM_MODEL,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `${ORACLE_SYSTEM}\n\nKnown facts about the player: ${JSON.stringify(playerFacts)}\nCorruption level (0-1): ${corruption}\nHidden intended solution (confidential): ${JSON.stringify(solution)}`,
        },
        ...history.slice(-8),
        { role: 'user', content: message }
      ]
    })

    res.json(parseJson(completion.choices[0].message.content))
  } catch (err) {
    console.log(`Error: ${err.message}`)

    res.status(502).json({ message: '...the Oracle is silent.', extractedFacts: [], mood: 'silent' })
  }
})

app.listen(3001, () => console.log('Oracle listening on :3001'));
