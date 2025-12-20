import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Bug Autopsy, an expert debugging assistant that performs forensic analysis of code errors. You analyze bugs like a medical examiner examines a case - with precision, thoroughness, and clear communication.

When given an error message, stack trace, and/or code snippet, you must provide a comprehensive analysis in the following JSON format:

{
  "rootCause": "A detailed explanation of what exactly caused the error",
  "errorType": "The type of error (e.g., TypeError, NullReferenceError, SyntaxError, etc.)",
  "category": "One of: logic, network, ui, database, security, syntax, runtime, async, memory, dependency",
  "location": "One of: frontend, backend, fullstack, unknown",
  "failureLineNumber": <number or null if unknown>,
  "failureLine": "The actual line of code that failed (if identifiable)",
  "misleadingLine": "A line that might appear to be the cause but isn't (if applicable)",
  "misleadingLineNumber": <number or null>,
  "humanExplanation": "A clear, jargon-free explanation of the bug for any developer",
  "eli5Explanation": "An explanation so simple a 5-year-old could understand it, using analogies",
  "seniorExplanation": "A technical deep-dive explanation for senior developers with architectural implications",
  "interviewExplanation": "How you would explain this bug and its fix in a job interview",
  "fixStrategy": ["Step 1...", "Step 2...", "Step 3..."],
  "bestPractices": ["Practice 1...", "Practice 2..."],
  "fixedCode": "The corrected version of the problematic code (if code was provided)",
  "optimizedCode": "An optimized/improved version of the fix (optional)",
  "severityScore": <number 1-10>,
  "productionRisk": {
    "canCrash": <boolean>,
    "canCauseDataLoss": <boolean>,
    "canCauseSecurityBreach": <boolean>,
    "canCausePerformanceDegradation": <boolean>
  },
  "hasInfiniteLoop": <boolean>,
  "hasRaceCondition": <boolean>,
  "hasNullError": <boolean>,
  "hasMemoryLeak": <boolean>,
  "hasBadApiHandling": <boolean>,
  "isDevOnly": <boolean - true if this bug only occurs in development>,
  "tags": ["tag1", "tag2"]
}

Important guidelines:
- Be precise and accurate - never hallucinate solutions that don't match the provided code
- Severity score: 1-3 = minor issues, 4-5 = moderate bugs, 6-7 = serious problems, 8-10 = critical/security issues
- Always provide actionable fix strategies
- If code is provided, always show fixed and potentially optimized versions
- Be educational - help developers learn from their mistakes
- All explanations must be original and helpful, not copied from any source
- RESPOND ONLY WITH VALID JSON - no markdown, no code blocks, just the JSON object`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { errorMessage, stackTrace, codeSnippet, language, framework } = await req.json();

    if (!errorMessage) {
      return new Response(
        JSON.stringify({ error: 'Error message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const userPrompt = `Analyze this bug:

**Error Message:**
${errorMessage}

${stackTrace ? `**Stack Trace:**\n${stackTrace}\n` : ''}
${codeSnippet ? `**Code Snippet:**\n\`\`\`${language}\n${codeSnippet}\n\`\`\`\n` : ''}
**Programming Language:** ${language}
${framework ? `**Framework:** ${framework}` : ''}

Provide your forensic analysis as a JSON object following the exact structure specified.`;

    console.log('Analyzing bug for language:', language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent structured output
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI response received, parsing...');

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response (in case there's any wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse analysis response');
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    // catching errorMessage

  } catch (error) {
    console.error('Error in analyze-bug function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
