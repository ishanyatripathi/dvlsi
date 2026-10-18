import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getManualContext } from '@/lib/search';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 10;

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  return new Groq({ apiKey });
}

function getModelName(): string {
  return process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, experimentId, experimentTitle } = body;

    // Validate
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required.' }, { status: 400 });
    }

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content || lastMessage.content.trim() === '') {
      return NextResponse.json({ error: 'Empty message.' }, { status: 400 });
    }

    if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message too long. Please shorten your query.' }, { status: 400 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { error: 'AI assistant is not configured. Set GROQ_API_KEY in your environment variables.' },
        { status: 503 }
      );
    }

    const model = getModelName();

    // Build system prompt
    let systemPrompt = `You are an Engineering Assistant for a Digital VLSI laboratory course at a university. You help students understand experiments, Verilog code, CMOS layouts, and digital circuit concepts.

BEHAVIOUR RULES:
1. Use the lab manual content provided (SOURCE 1) as your PRIMARY reference.
2. If answering from the manual, say so. If supplementing with general knowledge, clearly label it "SUPPLEMENTARY EXPLANATION:".
3. NEVER claim content came from the manual if it was not provided. NEVER invent page numbers or citations.
4. Preserve all original terminology from the manual exactly. Do not silently rewrite it.
5. For Verilog experiments, show the original code from the manual when asked. Never replace it with an AI-generated version without clearly labelling it.
6. Be technically precise. You are assisting engineering students, not a general audience.
7. Format your responses with Markdown: use headings, bullet points, tables, and code blocks (with language tags).
8. Keep explanations concise but complete.`;

    if (experimentId) {
      const manualContent = getManualContext(experimentId);
      systemPrompt += `\n\n---\nSOURCE 1 — LAB MANUAL CONTENT FOR CURRENTLY SELECTED EXPERIMENT:\n\n${manualContent}`;
      systemPrompt += `\n\nCurrently selected experiment: ${experimentTitle || experimentId}`;
    } else {
      systemPrompt += `\n\nNo experiment is currently selected. Answer using general Digital VLSI knowledge.`;
    }

    // Truncate history to last N messages
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content.slice(0, MAX_MESSAGE_LENGTH),
        })),
      ],
      max_tokens: 2048,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: 'No response from AI model.' }, { status: 502 });
    }

    return NextResponse.json({ content: responseText });
  } catch (err: unknown) {
    console.error('Groq API error:', err);

    // Handle Groq SDK errors
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: number }).status;
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key. Check your GROQ_API_KEY.' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 });
      }
      if (status === 503 || status === 502) {
        return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again shortly.' }, { status: 503 });
      }
    }

    if (err instanceof Error && err.message.includes('fetch')) {
      return NextResponse.json({ error: 'Network error. Check your internet connection.' }, { status: 502 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const configured = !!(process.env.GROQ_API_KEY?.trim());
  const model = getModelName();
  return NextResponse.json({ configured, model: configured ? model : null });
}
