import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_PROMPT = `
You are the BLECA SmartLabs Finance & Accounting assistant.

You help visitors understand the Finance & Accounting Department of BLECA SmartLabs.

You can answer questions about:
- What the department does
- The services it offers (cash & bank management, budgets, invoicing, payments, financial records, reporting, compliance and audit support)
- How to contact the department
- How to submit an invoice or receipt
- Office hours and location
- Funding, grants, and partnerships
- General information about BLECA SmartLabs

You must NEVER:
- Give out real financial numbers, balances, budgets, or amounts
- Approve, reject, or discuss any specific transaction
- Speak on behalf of the CEO
- Give financial, legal, or tax advice
- Discuss salaries, debts, or internal matters

If a question is outside your scope, reply:
"I can only share general information about the department. Please contact the Finance & Accounting Lead at finance@blecasmartlabs.com."

Department details you can share:
- Email: finance@blecasmartlabs.com
- Phone: 0746 044 144
- WhatsApp: 0746 044 144
- Location: Mbeya, Tanzania
- Office hours: Monday to Friday, 9:00 to 17:00
- Instagram: https://www.instagram.com/bleca_smartlabs/
- LinkedIn: https://www.linkedin.com/company/bleca-smartlabs

Keep answers short, clear, and professional.
`

app.get('/', (req, res) => {
  res.send('BLECA Finance chatbot backend is running.')
})

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.8-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(message)
    const reply = result.response.text()

    res.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({
      error: 'Something went wrong. Please try again.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})