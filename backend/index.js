import { env } from "cloudflare:workers"
import { httpServerHandler } from "cloudflare:node"
import OpenAi from "openai"
import express from "express"
import cors from "cors"
import { NPC_SYSTEM, ORACLE_SYSTEM } from "./prompts.js"

const app = express()
app.use(cors())
app.use(express.json())


const llm = new OpenAi({
  baseURL: env.LLM_BASE_URL,
  apiKey: env.LLM_API_KEY,
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

const parseNpcJson = (raw) => {
  if (typeof raw !== "string") throw new Error("Model returned no text")

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
    !Array.isArray(result.options) ||
    ![0, 2].includes(result.options.length) ||
    !result.options.every((option) => typeof option === "string" && option.trim())
  ) {
    throw new Error("Model JSON did not match the NPC response shape")
  }
  return {
    message: result.message,
    options: result.options,
  }
}

app.post("/api/oracle", async (req, res) => {
  const {
    message,
    solution = "",
    history = [],
    playerFacts = [],
    corruption = 0,
    currentMonth = "",
  } = req.body ?? {}

  try {
    const completion = await llm.chat.completions.create({
      model: env.LLM_MODEL,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${ORACLE_SYSTEM}\n\nKnown facts about the player: ${JSON.stringify(playerFacts)}\nCurrent in-game month (the harvest season runs from January through July): ${JSON.stringify(currentMonth)}\nCorruption level (0-1): ${corruption}\nHidden intended solution (confidential): ${JSON.stringify(solution)}`,
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

app.post("/api/npc", async (req, res) => {
  const {
    npcDescription = "",
    message = "",
    history = [],
    playerFacts = [],
    depth = 0,
  } = req.body ?? {}

  if (!Number.isInteger(depth) || depth < 0) {
    return res.status(400).json({
      message: "depth must be a non-negative integer",
    })
  }

  if (!npcDescription.trim() || !message.trim()) {
    return res.status(400).json({
      message: "npcDescription and message are required",
    })
  }

  try {
    const completion = await llm.chat.completions.create({
      model: env.LLM_MODEL,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${NPC_SYSTEM}\n\nNPC description:\n${npcDescription}\n\nKnown facts about the player:\n${JSON.stringify(playerFacts)}\n\nConversation depth: ${depth}. This is NPC response number ${depth + 1}. ${depth >= 2 ? "Return an empty options array because potential messages are no longer available after the third NPC response." : "Return exactly two potential player reply options."}`,
        },
        ...history.slice(-8),
        { role: "user", content: message },
      ],
    })

    const npcResponse = parseNpcJson(completion.choices[0].message.content)
    res.json({
      ...npcResponse,
      depth: depth + 1,
      options: depth >= 2 ? [] : npcResponse.options,
    })
  } catch (err) {
    console.log(`NPC error: ${err.message}`)
    res.status(502).json({
      message: "...the NPC falls strangely silent.",
      options: [],
      depth: depth + 1,
    })
  }
})

const server = app.listen(3001)

export default httpServerHandler(server)
