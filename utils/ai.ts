import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function generateResponse(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt
  })

  return text
}