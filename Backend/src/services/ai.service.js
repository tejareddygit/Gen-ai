const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE_GENAI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  vertexai: false,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(request, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      const status = error.status || error.code;

      if (![503, 429].includes(Number(status)) || attempt === maxAttempts) {
        throw error;
      }

      const waitTime = 1500 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini temporarily unavailable. Retrying in ${waitTime / 1000} seconds... (Attempt ${attempt + 1}/${maxAttempts})`,
      );

      await delay(waitTime);
    }
  }
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe("The match score between the candidate and the job description"),
  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe("The technical question can be asked in the interview"),
      intention: z
        .string()
        .describe("The intention of interviewer behind asking this question"),
      answer: z
        .string()
        .describe(
          "How to answer this question,what points to cover,what approach to take",
        ),
    }),
  ),
  behaviouralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question,what points to cover,what approach to take",
          ),
      }),
    )
    .describe(
      "Behavioural questions that can be asked int the interview along with their intention",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skillthat the candidate is lacking"),
        severity: z
          .enum(["High", "Medium", "Low"])
          .describe("The severity of the skill gap"),
        recommendation: z.string(),
      }),
    )
    .describe(
      "The skill gaps that the candidate has along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string()),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to prepare for the interview",
    ),
  title: z
    .string()
    .describe(
      "The title of the jobfor which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and career coach.

Analyze the candidate's resume, self-description and job description.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Generate a personalized interview preparation report.

Requirements:

1. matchScore:
   Give a score from 0 to 100 based on how well
   the candidate matches the job requirements.

2. technicalQuestions:
   Generate at least 10 relevant technical interview
   questions based on the resume and job description.

   For every question provide:
   - question
   - intention
   - answer approach

3. behaviouralQuestions:
   Generate at least 8 behavioural and HR questions.

   Include teamwork, conflict resolution, strengths,
   weaknesses, leadership, failure and career goals.

   For every question provide:
   - question
   - intention
   - answer approach

4. SKILL GAP ANALYSIS:

For every skill gap identified, you MUST provide:

1. skill: Name of the missing or weak skill.
2. severity: Exactly one of "High", "Medium", or "Low".
3. recommendation: Specific steps to improve that skill.

Severity classification:
- High: Essential job requirement that the candidate lacks.
- Medium: Important skill where the candidate has partial knowledge.
- Low: Preferred skill or minor improvement area.

IMPORTANT:
Every skillGaps object MUST contain all three fields.
Never omit severity.

5. preparationPlan:
  Create a realistic, personalized preparation timetable.
Choose the number of days based on the candidate's skill gaps,
current knowledge, and job requirements.
   Every day must contain:
   - day
   - focus
   - tasks

IMPORTANT:
- Generate questions specific to the candidate.
- Do not invent experience or skills.
- Do not leave any section empty unless information
  is genuinely insufficient.
- Return all five sections.
`;

  const response = await generateWithRetry({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema),
    },
  });
  console.log("Raw Gemini Response:", response.text);

  const parsedResponse = JSON.parse(response.text);

  const report = interviewReportSchema.parse(parsedResponse);

  console.log("Generated Interview Report:", report);

  return report;
}
module.exports = generateInterviewReport;
