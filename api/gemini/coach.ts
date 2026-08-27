import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mode, userMessage, chatHistory, contextData, currentStage } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json(getMockCoachResponse(mode, currentStage));
    }

    const isCoach = mode === 'COACH';
    const prompt = `You are the ${isCoach
      ? 'AI Coach using the GROW coaching framework (Goal, Reality, Options, Will/Way Forward)'
      : 'AI Mentor providing structured enterprise advice and practical best practices'
    } for "My Development Journey (MDJ)" platform.

User Context: ${JSON.stringify(contextData || {})}
Mode: ${mode}
Current GROW Stage: ${currentStage || 'G'}
User's latest message: "${userMessage}"
Conversation History: ${JSON.stringify(chatHistory || [])}

Instructions:
${isCoach
  ? '- Coach mode: Ask powerful clarifying questions for self-discovery. Progress G -> R -> O -> W.'
  : '- Mentor mode: Provide practical, seasoned enterprise advice and actionable frameworks.'
}
- Tone: Professional, encouraging, concise (2-3 paragraphs max).
- If concrete actions emerge at W stage, extract key reflections and IDP commitments.

Return ONLY valid JSON (no markdown):
{
  "response": "string (markdown formatted, use **bold** for stage labels)",
  "growStage": "G",
  "keyReflections": ["string"],
  "actionCommitments": ["string"],
  "suggestedActivity": {
    "goal": "string", "programName": "string",
    "frameworkType": "20_EXPOSURE",
    "measurement": "string", "learningHours": 10, "xpValue": 150
  }
}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    res.json(JSON.parse(text.trim()));
  } catch (err: any) {
    console.error('Coach error:', err);
    res.status(500).json({ error: err.message });
  }
}

function getMockCoachResponse(mode: string, currentStage: string) {
  const isCoach = mode === 'COACH';
  const stage = currentStage || 'G';
  const responses: Record<string, string> = {
    G: '**[GROW - Goal]**: What would a 10/10 outcome look like? How will you know you succeeded?',
    R: '**[GROW - Reality]**: What specific constraints or assumptions have made this challenging so far?',
    O: '**[GROW - Options]**: If you had zero risk constraints, what are 2-3 distinct paths you could take?',
    W: '**[GROW - Way Forward]**: What is the single most decisive action you will take in the next 48 hours?',
  };

  return {
    response: isCoach ? (responses[stage] || responses['G']) : '**[Mentor Guidance]**: In enterprise technology leadership, start with Business Value First, then De-risk with a Pilot, and build Cross-functional Buy-in early.',
    growStage: stage === 'G' ? 'R' : stage === 'R' ? 'O' : stage === 'O' ? 'W' : 'W',
    keyReflections: stage === 'W' ? ['Executive communication succeeds when complexity is translated into business risk and ROI.'] : [],
    actionCommitments: stage === 'W' ? ['Draft a 1-page executive briefing memo before the formal presentation.'] : [],
    suggestedActivity: stage === 'W' ? {
      goal: 'Deliver high-impact executive presentation and secure stakeholder sign-off',
      programName: 'Executive Presentation & Strategic Steering Simulation',
      frameworkType: '20_EXPOSURE',
      measurement: 'Successful executive approval with positive sponsor feedback.',
      learningHours: 10, xpValue: 180,
    } : undefined,
  };
}
