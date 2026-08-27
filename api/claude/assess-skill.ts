import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { skillName, skillDefinition, currentLevel, targetLevel, assessmentMethod } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json(getMockAssessment(skillName));
    }

    const prompt = `Generate an adaptive skill reassessment scenario for an enterprise professional.

Skill: "${skillName}"
Definition: "${skillDefinition}"
Current Proficiency: ${currentLevel || 3.0} / 5.0
Target Proficiency: ${targetLevel || 4.5} / 5.0
Assessment Method: ${assessmentMethod || 'Scenario-based'}

Return ONLY valid JSON (no markdown):
{
  "scenarioTitle": "string",
  "scenarioDescription": "string",
  "questions": [
    {
      "id": "string",
      "prompt": "string",
      "options": [
        { "text": "string", "isCorrect": true, "explanation": "string" },
        { "text": "string", "isCorrect": false, "explanation": "string" },
        { "text": "string", "isCorrect": false, "explanation": "string" }
      ]
    }
  ],
  "xpReward": 150,
  "estimatedProficiencyBoost": 0.3
}
Generate 2-3 challenging scenario-based questions appropriate for the proficiency gap.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let jsonText = text.trim();
    const mdMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (mdMatch) jsonText = mdMatch[1].trim();
    res.json(JSON.parse(jsonText));
  } catch (err: any) {
    console.error('Assessment error:', err);
    res.status(500).json({ error: err.message });
  }
}

function getMockAssessment(skillName: string) {
  return {
    scenarioTitle: `${skillName}: Enterprise Capability Challenge`,
    scenarioDescription: `You are the lead architect facing a critical decision requiring advanced ${skillName}. An enterprise client with 2M daily active users needs an immediate architectural solution.`,
    questions: [
      {
        id: 'q1',
        prompt: `How do you formulate the key trade-offs for this enterprise scenario?`,
        options: [
          { text: 'Implement asynchronous event-driven architecture with eventual consistency and saga workflows.', isCorrect: true, explanation: 'Best practice for decoupling high-scale enterprise distributed transactions.' },
          { text: 'Enforce synchronous 2-phase commits across all distributed databases simultaneously.', isCorrect: false, explanation: 'Causes severe latency bottlenecks and single points of failure.' },
          { text: 'Disable replication during peak hours to prioritize compute performance.', isCorrect: false, explanation: 'Creates severe risk of data loss and regulatory non-compliance.' },
        ],
      },
      {
        id: 'q2',
        prompt: `When presenting this solution to the C-suite, what is the most critical metric to lead with?`,
        options: [
          { text: 'Business continuity, financial risk prevention, and MTTR reduction.', isCorrect: true, explanation: 'Directly aligns technical investment with executive risk appetite and ROI.' },
          { text: 'The specific framework version number utilized in the solution.', isCorrect: false, explanation: 'Too low-level for executive decision making.' },
          { text: 'The number of engineering hours required for implementation.', isCorrect: false, explanation: 'Secondary metric — executives prioritize business outcome over effort.' },
        ],
      },
    ],
    xpReward: 150,
    estimatedProficiencyBoost: 0.3,
  };
}
