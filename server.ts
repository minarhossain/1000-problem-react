import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Mentor & Code Review API route
app.post('/api/ai-mentor', async (req: Request, res: Response) => {
  try {
    const { problemTitle, problemDescription, userCode, mode } = req.body;

    if (!problemTitle) {
      return res.status(400).json({ error: 'Problem title is required' });
    }

    if (!aiClient) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        response: `[Offline AI Mentor]:
Here is a structured guideline for "${problemTitle}":

1. **Mental Model**: In React, components re-render whenever state or props change. Pay close attention to dependency arrays, immutability, and state colocation.
2. **Key Consideration for this Problem**: ${mode === 'hint' ? 'Break down the state update into discrete steps and ensure cleanup functions are returned if setting up timers or subscriptions.' : 'Ensure memoization is only applied when expensive calculations justify it, and avoid mutating state directly in place.'}
3. **Next Step**: Check your console logs and test the edge cases (empty states, rapid re-renders, unmounting).

Tip: Configure your GEMINI_API_KEY in the AI Studio Secrets panel to unlock live deep-thinking code analysis!`,
      });
    }

    let systemInstruction = 'You are a world-class Principal React Engineer and Staff Technical Interviewer.';
    let prompt = '';

    if (mode === 'hint') {
      systemInstruction += ' Provide an insightful, progressive hint for the given React coding problem without revealing the entire solution code. Guide their mental model.';
      prompt = `Problem: ${problemTitle}\nDescription: ${problemDescription}\nUser's current code:\n\`\`\`jsx\n${userCode || 'No code written yet'}\n\`\`\`\n\nGive 2 progressive hints and 1 key React concept to keep in mind.`;
    } else if (mode === 'review') {
      systemInstruction += ' Perform a rigorous senior-level code review of the user React code. Check for: performance issues, stale closures, missing hook dependencies, unhandled edge cases, accessibility, clean architecture, and React 18/19 best practices.';
      prompt = `Problem: ${problemTitle}\nUser's Solution Code:\n\`\`\`jsx\n${userCode}\n\`\`\`\n\nProvide:
1. Verdict (Correct / Partial / Needs Work)
2. Architectural Strengths
3. Potential Gotchas or Anti-Patterns (e.g. stale closures, unnecessary re-renders)
4. Recommended Clean Modern React Refactor suggestions.`;
    } else if (mode === 'interview') {
      systemInstruction += ' You are interviewing a candidate for a Senior Frontend React position at a top tier tech company (Meta, Stripe, Uber).';
      prompt = `The candidate just solved or is solving: ${problemTitle}\nCode:\n\`\`\`jsx\n${userCode}\n\`\`\`\n\nAsk 3 tough senior-level follow-up interview questions regarding scale, concurrency, fiber reconciliation, performance bottlenecks, or edge cases.`;
    } else {
      prompt = `Help explain the React concepts, mental models, and real-world design patterns behind: ${problemTitle}\nDescription: ${problemDescription}`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ response: response.text });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({
      error: 'Failed to generate AI mentor response',
      details: error.message,
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`React 1000 Server listening on port ${port}`);
  });
}

startServer();
