import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: '3-Set Venn Engine & De Morgan Logic Studio' });
});

// Sir Eugene Socratic Coach Hint Endpoint
app.post('/api/socratic-hint', async (req, res) => {
  try {
    const {
      expression,
      shadedRegions,
      activeMode,
      surveyContext,
      studentName,
      userQuestion,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Offline heuristic fallback when API key is not provided
      const fallbackHint = generateOfflineSocraticHint(expression, shadedRegions, activeMode, surveyContext);
      return res.json({
        hint: fallbackHint,
        mode: 'offline_heuristic',
        author: 'Sir Eugene (Offline Logic Core)'
      });
    }

    const systemPrompt = `You are "Sir Eugene", a world-class, charismatic, and encouraging Senior High School (SHS) & Collegiate Mathematics Master Educator specializing in Set Theory, Boolean Algebra, Venn Diagrams, and De Morgan's Laws.
Your pedagogy is strictly SOCRATIC:
1. Provide concise, powerful guidance in 2 to 3 sentences maximum.
2. NEVER give away the direct answer or list all final numbers/regions immediately.
3. Instead, ask a thought-provoking guiding question or point to a foundational set relationship (e.g. "What happens when you subtract the union?", "Which elements belong to both A and B but are outside C?", "Recall how complement distributes over union according to De Morgan").
4. Maintain a warm, scholarly, mentor-like tone addressing the student enthusiastically. Use standard mathematical notation.`;

    const prompt = `Student Name: ${studentName || 'Scholar'}
Active Studio Mode: ${activeMode || '3-Set Venn Logic Stage'}
Current Expression: ${expression || 'Custom Region Shading'}
Currently Shaded Regions: ${JSON.stringify(shadedRegions || [])} (out of 8 regions: r1=A only, r2=B only, r3=C only, r4=A&B only, r5=A&C only, r6=B&C only, r7=all three, r8=outside all)
Survey Context (if applicable): ${JSON.stringify(surveyContext || null)}
Student Question/Prompt: ${userQuestion || 'Help me understand the relationship of these shaded regions and the algebraic logic.'}

Provide a brilliant Socratic hint for this student.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const hintText = response.text?.trim() || generateOfflineSocraticHint(expression, shadedRegions, activeMode, surveyContext);

    return res.json({
      hint: hintText,
      mode: 'gemini_ai',
      author: 'Sir Eugene AI Coach'
    });
  } catch (error) {
    console.error('Gemini Socratic Coach API error:', error);
    const fallback = generateOfflineSocraticHint(
      req.body?.expression,
      req.body?.shadedRegions,
      req.body?.activeMode,
      req.body?.surveyContext
    );
    return res.json({
      hint: fallback,
      mode: 'fallback_heuristic',
      author: 'Sir Eugene (Heuristic Coach)'
    });
  }
});

function generateOfflineSocraticHint(
  expression?: string,
  shadedRegions?: number[],
  activeMode?: string,
  surveyContext?: any
): string {
  const regions = shadedRegions || [];
  if (activeMode === 'demorgan') {
    return "De Morgan's insight: Notice how taking the complement of a union (A ∪ B ∪ C)' turns the 'OR' boundary into an intersection 'AND' outside all three sets (A' ∩ B' ∩ C'). Test if the shaded boundaries align perfectly!";
  }
  if (activeMode === 'survey' && surveyContext) {
    return "In 3-set survey problems, always anchor from the innermost core: start with n(A ∩ B ∩ C). How does knowing the central triple-intersection help you subtract to find the exact two-set overlaps?";
  }
  if (regions.length === 0) {
    return "The Venn canvas is currently clear. Try clicking Region 7 (the central core where all three sets overlap) or enter an expression like (A ∩ B) \\ C to see the boundary dynamics.";
  }
  if (regions.includes(7) && regions.length === 1) {
    return "You have selected Region 7 (A ∩ B ∩ C). What must change if an element belongs to both A and B, but fails to satisfy condition C?";
  }
  if (regions.includes(8)) {
    return "Region 8 represents the Universal complement (A ∪ B ∪ C)'. What is the relationship between the elements inside any circle and those residing in this outer boundary?";
  }
  return `Analyzing your ${regions.length} shaded region(s): Consider which universal condition includes all these regions while excluding the remaining ${8 - regions.length}. How would you write this using intersection and union?`;
}

// Vite middleware or production static serving
async function startServer() {
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
    console.log(`Sir Eugene Set Logic Studio running on port ${PORT}`);
  });
}

startServer();
