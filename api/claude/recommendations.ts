import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      organizationGoal, individualKpi, currentPosition, businessUnit,
      assessmentResults, areasOfImprovement, strengths, aspiration,
      nextPosition, targetBusinessUnit, developmentHistory,
    } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json(getMockRecommendations(currentPosition, nextPosition, organizationGoal));
    }

    const prompt = `You are the AI Development Recommendation Engine for "My Development Journey (MDJ)", an enterprise talent development platform.
Generate a complete, personalized 70:20:10 Individual Development Plan (IDP) recommendation.

Employee Context:
- Organization Goal: ${organizationGoal || 'Group 2026 Digital North Star'}
- Individual KPI: ${individualKpi || 'Deliver zero-downtime microservices migration'}
- Current Position: ${currentPosition || 'Lead Cloud Solutions Architect & Tech Lead'}
- Business Unit: ${businessUnit || 'Digital Transformation & Enterprise Cloud BU'}
- Areas of Improvement: ${areasOfImprovement || 'Executive Boardroom Influence, P&L Valuation, Strategic Architecture'}
- Strengths: ${strengths || 'Distributed Systems, GenAI Engineering, Agile Scale'}
- Career Aspiration: ${aspiration || 'Head of Enterprise Architecture'}
- Next Position: ${nextPosition || 'Head of Enterprise Architecture'}
- Target BU: ${targetBusinessUnit || 'Group Technology & Digital Transformation'}
- Development History: ${developmentHistory || 'AWS Pro Architect, SAFe Consultant, FinOps Practitioner'}

Return ONLY valid JSON (no markdown) matching this schema:
{
  "confidenceScore": 95,
  "prioritySkillGaps": [{ "skill": "string", "gap": 1.2, "rationale": "string" }],
  "primaryObjective": "string",
  "businessGoalAlignment": "string",
  "recommendedActivities": [{
    "id": "string", "goal": "string", "programName": "string", "provider": "string",
    "frameworkType": "70_EXPERIENCE",
    "timelineStart": "2026-03-01", "timelineEnd": "2026-06-30",
    "measurement": "string", "skillNames": ["string"], "expectedImpact": "string",
    "learningHours": 30, "xpValue": 300, "relevanceScore": 95
  }]
}
Include at least one 70_EXPERIENCE, one 20_EXPOSURE, and one 10_LEARNING activity.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 8096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let jsonText = text.trim();
    const mdMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (mdMatch) jsonText = mdMatch[1].trim();
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    res.json(JSON.parse(jsonText));
  } catch (err: any) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: err.message });
  }
}

function getMockRecommendations(currentPosition: string, nextPosition: string, organizationGoal: string) {
  return {
    confidenceScore: 94,
    prioritySkillGaps: [
      { skill: 'Strategic Architecture & Systems Thinking', gap: 1.3, rationale: 'Crucial for transitioning to Head of Enterprise Architecture.' },
      { skill: 'Strategic Leadership & Executive Influence', gap: 1.2, rationale: 'Required to gain C-suite sign-off for large-scale investments.' },
      { skill: 'Enterprise GenAI Solutions & Agentic Systems', gap: 1.0, rationale: 'Aligns with Group 2026 Digital North Star AI initiatives.' },
    ],
    primaryObjective: `Accelerate architectural maturity to transition from ${currentPosition || 'Lead Architect'} to ${nextPosition || 'Head of Enterprise Architecture'}.`,
    businessGoalAlignment: organizationGoal || 'Aligns with enterprise modernization and AI infrastructure delivery.',
    recommendedActivities: [
      {
        id: `rec-${Date.now()}-1`, frameworkType: '70_EXPERIENCE',
        goal: 'Lead enterprise-scale hybrid cloud migration',
        programName: 'Enterprise Multi-Cloud Transformation & Legacy Modernization Project',
        provider: 'Internal Architecture Board', timelineStart: '2026-03-01', timelineEnd: '2026-06-30',
        measurement: 'Successful pilot migration with zero downtime and <15ms latency.',
        skillNames: ['Strategic Architecture & Systems Thinking'], expectedImpact: 'Proficiency 3.2 → 4.2',
        learningHours: 32, xpValue: 350, relevanceScore: 96,
      },
      {
        id: `rec-${Date.now()}-2`, frameworkType: '20_EXPOSURE',
        goal: 'Gain executive boardroom exposure and master executive persuasion',
        programName: 'Executive Leadership Immersion & C-Suite Shadowing',
        provider: 'TechConnect Executive Committee', timelineStart: '2026-03-15', timelineEnd: '2026-05-30',
        measurement: 'Co-present Group Cloud Strategy to CTO.',
        skillNames: ['Strategic Leadership & Executive Influence'], expectedImpact: 'Gap closed from 1.2 to 0.2',
        learningHours: 16, xpValue: 200, relevanceScore: 92,
      },
      {
        id: `rec-${Date.now()}-3`, frameworkType: '10_LEARNING',
        goal: 'Master autonomous multi-agent systems and agentic AI architectures',
        programName: 'Agentic AI Architecture & Vector Governance',
        provider: 'Enterprise AI Academy', timelineStart: '2026-03-01', timelineEnd: '2026-04-15',
        measurement: 'Complete 3 capstone labs and deploy a working multi-agent prototype.',
        skillNames: ['Enterprise GenAI Solutions & Agentic Systems'], expectedImpact: 'GenAI proficiency 3.0 → 4.0',
        learningHours: 24, xpValue: 250, relevanceScore: 95,
      },
    ],
  };
}
