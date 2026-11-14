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

const parseJson = (raw) => {
  if (typeof raw !== "string") throw new Error("Model returned no text")

  // JSON mode should prevent this, but some OpenAI-compatible providers still
  // return a fenced object or a short preamble.
  const cleaned = raw
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim()
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start < 0 || end < start) throw new Error("Model returned invalid JSON")

  const result = JSON.parse(cleaned.slice(start, end + 1))
  if (
    !result ||
    typeof result.message !== "string" ||
    !Array.isArray(result.extractedFacts) ||
    !result.extractedFacts.every((fact) => typeof fact === "string") ||
    typeof result.mood !== "string"
  ) {
    throw new Error("Model JSON did not match the Oracle response shape")
  }
  return {
    message: result.message,
    extractedFacts: result.extractedFacts,
    mood: result.mood,
  }
}

app.post("/api/oracle", async (req, res) => {
  const { message, solution = "", history = [], playerFacts = [], corruption = 0 } = req.body

  try {
    const completion = await llm.chat.completions.create({
      model: process.env.LLM_MODEL,
      temperature: 0.9,
      response_format: { type: "json_object" },
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
