import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const PORT = 3000;

// Lazy initialization of Claude client
let claudeClient: Anthropic | null = null;
function getClaude(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!claudeClient) {
    claudeClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return claudeClient;
}

async function callClaude(prompt: string): Promise<string> {
  const client = getClaude();
  if (!client) throw new Error('ANTHROPIC_API_KEY not set');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt + '\n\nRespond ONLY with valid JSON, no markdown code blocks, no extra text.',
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return text.trim();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. AI Development Recommendation Engine
  app.post('/api/gemini/recommendations', async (req, res) => {
    try {
      const {
        organizationGoal,
        individualKpi,
        currentPosition,
        businessUnit,
        assessmentResults,
        areasOfImprovement,
        strengths,
        aspiration,
        nextPosition,
        targetBusinessUnit,
        developmentHistory,
      } = req.body;

      const client = getClaude();

      if (!client) {
        // Fallback mock if no API key is set
        return res.json({
          confidenceScore: 94,
          prioritySkillGaps: [
            {
              skill: 'Strategic Architecture & Systems Thinking',
              gap: 1.3,
              rationale: 'Crucial for transitioning to Head of Enterprise Architecture and driving multi-cloud governance.',
            },
            {
              skill: 'Strategic Leadership & Executive Influence',
              gap: 1.2,
              rationale: 'Required to gain C-suite sign-off for large-scale technology modernization budgets.',
            },
            {
              skill: 'Enterprise GenAI Solutions & Agentic Systems',
              gap: 1.0,
              rationale: 'Aligns directly with Group 2026 Digital North Star to automate core operational workflows.',
            },
          ],
          primaryObjective: `Accelerate architectural maturity and executive influence to successfully transition from ${currentPosition || 'Lead Architect'} to ${nextPosition || 'Head of Enterprise Architecture'}.`,
          businessGoalAlignment: organizationGoal || 'Aligns with enterprise modernization, zero-trust security, and scalable AI infrastructure delivery.',
          recommendedActivities: [
            {
              id: `rec-${Date.now()}-1`,
              goal: 'Lead enterprise-scale hybrid cloud migration and establish cross-BU architectural guardrails',
              programName: 'Enterprise Multi-Cloud Transformation & Legacy Modernization Project',
              provider: 'Internal Architecture Board & Enterprise Guild',
              frameworkType: '70_EXPERIENCE',
              timelineStart: '2026-03-01',
              timelineEnd: '2026-06-30',
              measurement: 'Successful live pilot migration of core billing engine with zero downtime and <15ms latency SLAs.',
              skillNames: ['Strategic Architecture & Systems Thinking', 'Cloud Security Governance & FinOps Optimization'],
              expectedImpact: 'Improves Strategic Architecture proficiency from 3.2 to 4.2; unlocks $180k annual infrastructure savings.',
              learningHours: 32,
              xpValue: 350,
              relevanceScore: 96,
            },
            {
              id: `rec-${Date.now()}-2`,
              goal: 'Gain executive boardroom exposure and master executive persuasion for technical investments',
              programName: 'Executive Leadership Immersion & C-Suite Shadowing',
              provider: 'TechConnect Executive Committee & HR Leadership Hub',
              frameworkType: '20_EXPOSURE',
              timelineStart: '2026-03-15',
              timelineEnd: '2026-05-30',
              measurement: 'Co-present Group Cloud Strategy to CTO and deliver 3 structured 1-on-1 coaching sessions to junior leads.',
              skillNames: ['Strategic Leadership & Executive Influence', 'Business Strategy & Product P&L Management'],
              expectedImpact: 'Closes Strategic Leadership gap from 2.8 to 3.8 and boosts confidence to 92%.',
              learningHours: 16,
              xpValue: 200,
              relevanceScore: 92,
            },
            {
              id: `rec-${Date.now()}-3`,
              goal: 'Master autonomous multi-agent systems and real-time streaming architectures',
              programName: 'Agentic AI Architecture & Vector Governance',
              provider: 'Enterprise AI Academy & TechConnect L&D',
              frameworkType: '10_LEARNING',
              timelineStart: '2026-03-01',
              timelineEnd: '2026-04-15',
              measurement: 'Complete 3 lab sprint capstones and deploy a working multi-agent prototype with live telemetry.',
              skillNames: ['Enterprise GenAI Solutions & Agentic Systems'],
              expectedImpact: 'Increases GenAI capability from 3.5 to 4.5; awards Certified Enterprise AI Architect badge.',
              learningHours: 24,
              xpValue: 250,
              relevanceScore: 95,
            },
          ],
        });
      }

      const prompt = `You are the AI Development Recommendation Engine for "My Development Journey (MDJ)", an enterprise talent development platform.
Analyze the following employee context and generate a complete, personalized 70:20:10 Individual Development Plan (IDP) recommendation in JSON format.

Employee & Organizational Context:
- Organization Goal: ${organizationGoal || 'Group 2026 Digital North Star: 40% reduction in cloud latency, FinOps optimization, and enterprise AI adoption'}
- Individual KPI: ${individualKpi || 'Deliver zero-downtime microservices migration and lead cross-squad architecture'}
- Current Position: ${currentPosition || 'Lead Cloud Solutions Architect & Tech Lead'}
- Business Unit: ${businessUnit || 'Digital Transformation & Enterprise Cloud BU'}
- Assessment Results: ${JSON.stringify(assessmentResults || {})}
- Areas of Improvement: ${areasOfImprovement || 'Executive Boardroom Influence, P&L Valuation, Strategic Architecture'}
- Strengths: ${strengths || 'Distributed Systems, GenAI Engineering, Agile Scale'}
- Career Aspiration: ${aspiration || 'Head of Enterprise Architecture & Cloud Engineering'}
- Next Position Target: ${nextPosition || 'Head of Enterprise Architecture'}
- Target Business Unit: ${targetBusinessUnit || 'Group Technology & Digital Transformation'}
- Development History: ${developmentHistory || 'AWS Pro Architect, SAFe Consultant, FinOps Practitioner'}

Return a JSON object with this exact schema:
{
  "confidenceScore": 95,
  "prioritySkillGaps": [
    { "skill": "string", "gap": 1.2, "rationale": "string" }
  ],
  "primaryObjective": "string",
  "businessGoalAlignment": "string",
  "recommendedActivities": [
    {
      "id": "string",
      "goal": "string",
      "programName": "string",
      "provider": "string",
      "frameworkType": "70_EXPERIENCE",
      "timelineStart": "2026-03-01",
      "timelineEnd": "2026-06-30",
      "measurement": "string",
      "skillNames": ["string"],
      "expectedImpact": "string",
      "learningHours": 30,
      "xpValue": 300,
      "relevanceScore": 95
    }
  ]
}
Include at least one 70_EXPERIENCE, one 20_EXPOSURE, and one 10_LEARNING activity.`;

      const text = await callClaude(prompt);
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Error generating AI recommendations:', err);
      res.status(500).json({ error: err.message || 'Failed to generate recommendations' });
    }
  });

  // 2. AI Coach & Mentor Conversation Engine
  app.post('/api/gemini/coach', async (req, res) => {
    try {
      const { mode, userMessage, chatHistory, contextData, currentStage } = req.body;

      const client = getClaude();

      if (!client) {
        // Fallback responses
        const isCoach = mode === 'COACH';
        let botResponse = '';
        let nextStage: 'G' | 'R' | 'O' | 'W' = currentStage || 'G';
        let keyReflections: string[] = [];
        let actionCommitments: string[] = [];

        if (isCoach) {
          if (!currentStage || currentStage === 'G') {
            botResponse = `**[GROW - Goal Clarification]**: Thank you for sharing. To ensure we aim for maximum impact, what would a 10/10 outcome look like when you address this? How will you and your stakeholders know you have succeeded?`;
            nextStage = 'R';
          } else if (currentStage === 'R') {
            botResponse = `**[GROW - Reality & Context]**: Understood. Let's look at the current reality: what specific behaviors, assumptions, or organizational constraints have made this challenging so far?`;
            nextStage = 'O';
          } else if (currentStage === 'O') {
            botResponse = `**[GROW - Options & Possibilities]**: If you had zero risk constraints, what are 2 or 3 distinct paths you could take?`;
            nextStage = 'W';
          } else {
            botResponse = `**[GROW - Way Forward & Commitment]**: What is the single most decisive action you will take in the next 48 hours?`;
            nextStage = 'W';
            keyReflections = ['Executive communication succeeds when technical complexity is translated into business risk and dollar ROI.'];
            actionCommitments = ['Draft a 1-page executive briefing memo before the formal presentation.'];
          }
        } else {
          botResponse = `**[Mentor Guidance]**: In enterprise technology leadership, navigating this requires a structured approach: Business Value First, De-risking Pilot Architecture, and Cross-functional Buy-in.`;
          keyReflections = ['Adopted the Enterprise Technology Value framework.'];
          actionCommitments = ['Incorporate phased pilot de-risking into upcoming roadmap proposal.'];
        }

        return res.json({
          response: botResponse,
          growStage: nextStage,
          keyReflections,
          actionCommitments,
          suggestedActivity: actionCommitments.length > 0 ? {
            goal: 'Deliver high-impact executive presentation and secure stakeholder sign-off',
            programName: 'Executive Presentation & Strategic Steering Simulation',
            frameworkType: '20_EXPOSURE',
            measurement: 'Successful executive approval on quarterly initiative.',
            learningHours: 10,
            xpValue: 180,
          } : undefined,
        });
      }

      const isCoach = mode === 'COACH';
      const prompt = `You are the ${isCoach ? 'AI Coach using the GROW coaching framework (Goal, Reality, Options, Will/Way Forward)' : 'AI Mentor providing structured enterprise advice and practical best practices'} for "My Development Journey (MDJ)".

User Context: ${JSON.stringify(contextData || {})}
Mode: ${mode}
Current GROW Stage: ${currentStage || 'G'}
User's latest message: "${userMessage}"
Conversation History: ${JSON.stringify(chatHistory || [])}

Instructions:
1. ${isCoach ? 'In Coach mode: Ask powerful clarifying questions that stimulate self-discovery. Progress through G -> R -> O -> W stages.' : 'In Mentor mode: Provide practical, seasoned executive engineering advice and frameworks.'}
2. Tone: Professional, encouraging, concise (2-3 paragraphs max).
3. If concrete actions emerge or W stage is reached, extract key reflections and commitments for the employee IDP.

Return JSON with this schema:
{
  "response": "string (markdown formatted)",
  "growStage": "G",
  "keyReflections": ["string"],
  "actionCommitments": ["string"],
  "suggestedActivity": {
    "goal": "string",
    "programName": "string",
    "frameworkType": "20_EXPOSURE",
    "measurement": "string",
    "learningHours": 10,
    "xpValue": 150
  }
}`;

      const text = await callClaude(prompt);
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Error in AI Coach endpoint:', err);
      res.status(500).json({ error: err.message || 'Failed to process AI Coach request' });
    }
  });

  // 3. Adaptive Skill Reassessment Generator
  app.post('/api/gemini/assess-skill', async (req, res) => {
    try {
      const { skillName, skillDefinition, currentLevel, targetLevel, assessmentMethod } = req.body;
      const client = getClaude();

      if (!client) {
        return res.json({
          scenarioTitle: `${skillName}: Enterprise Capability Challenge`,
          scenarioDescription: `You are the lead architect facing a critical challenge requiring advanced ${skillName}.`,
          questions: [
            {
              id: 'q1',
              prompt: `How do you formulate the architecture trade-offs for this enterprise system?`,
              options: [
                { text: 'Implement asynchronous event-driven streaming with eventual consistency.', isCorrect: true, explanation: 'Best practice for decoupling high-scale enterprise distributed transactions.' },
                { text: 'Enforce synchronous 2-phase commits across all distributed databases.', isCorrect: false, explanation: 'Causes severe latency bottlenecks and single points of failure.' },
              ],
            },
          ],
          xpReward: 150,
          estimatedProficiencyBoost: 0.3,
        });
      }

      const prompt = `Generate an adaptive skill reassessment scenario and multiple-choice questions for:
Skill: "${skillName}"
Definition: "${skillDefinition}"
Current Proficiency: ${currentLevel || 3.0} / 5.0
Target Proficiency: ${targetLevel || 4.5} / 5.0
Assessment Method: ${assessmentMethod || 'Scenario-based'}

Return JSON with this schema:
{
  "scenarioTitle": "string",
  "scenarioDescription": "string",
  "questions": [
    {
      "id": "string",
      "prompt": "string",
      "options": [
        { "text": "string", "isCorrect": true, "explanation": "string" },
        { "text": "string", "isCorrect": false, "explanation": "string" }
      ]
    }
  ],
  "xpReward": 150,
  "estimatedProficiencyBoost": 0.3
}`;

      const text = await callClaude(prompt);
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Error generating assessment:', err);
      res.status(500).json({ error: err.message || 'Failed to generate assessment' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MDJ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
