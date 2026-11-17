import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health', (c) => {
  return c.text('Hello Hono!')
})

app.post('/webhook', async (c) => {
  // Verify the request came from Telegram
  const secret = c.req.header('x-telegram-bot-api-secret-token')
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return c.text('Unauthorized', 401)
  }

  const update = await c.req.json().catch(() => null)
  const message = update?.message
  const chatId = message?.chat?.id
  const text = message?.text

  if (chatId && typeof text === 'string') {
    // Echo the message back (fire-and-forget; respond to Telegram quickly)
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    }).then((response) => {
      if (!response.ok) {
        console.error('sendMessage failed with HTTP status', response.status)
      }
    }).catch((err) => console.error('sendMessage failed', err))
  }

  return c.text('ok')
})

const port = Number(process.env.PORT) || 3000

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})