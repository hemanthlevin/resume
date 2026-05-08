const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ResumeAI Backend' }));

// ── Main resume generation endpoint ─────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { mode, details } = req.body;

  if (!details || !mode) {
    return res.status(400).json({ error: 'Missing mode or details.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const prompt = buildPrompt(mode, details);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const raw = (data.content || []).map(b => b.text || '').join('');
    res.json({ raw, mode });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── Prompt builder for all 5 modes ──────────────────────────────────────────
function buildPrompt(mode, d) {
  const info = `
Name: ${d.name}
Target Role: ${d.role || 'Not specified'}
Email: ${d.email || 'Not provided'}
Phone/Location: ${d.location || 'Not provided'}
LinkedIn: ${d.linkedin || 'Not provided'}
Summary: ${d.summary}
Work Experience: ${d.experience || 'Not provided'}
Education: ${d.education || 'Not provided'}
Certifications: ${d.certs || 'Not provided'}
Technical Skills: ${d.tech_skills || 'Not provided'}
Soft Skills: ${d.soft_skills || 'Not provided'}
Languages Known: ${d.languages || 'Not provided'}
Projects/Achievements: ${d.projects || 'Not provided'}`.trim();

  const jsonRule = 'Output ONLY a raw JSON object. No markdown fences, no explanation, no text before or after the JSON.';

  switch (mode) {

    case 'telugu_english':
      return `You are a bilingual resume writer (Telugu + English). ${jsonRule}

USER DETAILS:
${info}

JSON format (use \\n for newlines inside string values):
{
  "name_native": "name in Telugu script",
  "role_native": "job title in Telugu",
  "contact_native": "email | phone | city in Telugu",
  "body_native": "Full resume in Telugu script with sections: వృత్తిపరమైన సారాంశం, పని అనుభవం, విద్య, నైపుణ్యాలు — use • bullets",
  "name_english": "name in English",
  "role_english": "job title in English",
  "contact_english": "email | phone | city",
  "body_english": "PROFESSIONAL SUMMARY\\n...\\n\\nWORK EXPERIENCE\\n• ...\\n\\nEDUCATION\\n...\\n\\nSKILLS\\nTechnical: ...\\nSoft Skills: ..."
}`;

    case 'tamil_english':
      return `You are a bilingual resume writer (Tamil + English). ${jsonRule}

USER DETAILS:
${info}

JSON format (use \\n for newlines inside string values):
{
  "name_native": "name in Tamil script",
  "role_native": "job title in Tamil",
  "contact_native": "email | phone | city in Tamil",
  "body_native": "Full resume in Tamil script with sections: தொழில்முறை சுருக்கம், பணி அனுபவம், கல்வி, திறன்கள் — use • bullets",
  "name_english": "name in English",
  "role_english": "job title in English",
  "contact_english": "email | phone | city",
  "body_english": "PROFESSIONAL SUMMARY\\n...\\n\\nWORK EXPERIENCE\\n• ...\\n\\nEDUCATION\\n...\\n\\nSKILLS\\nTechnical: ...\\nSoft Skills: ..."
}`;

    case 'only_telugu':
      return `You are a professional resume writer. Write a resume ENTIRELY in Telugu script. ${jsonRule}

USER DETAILS:
${info}

JSON format (use \\n for newlines):
{
  "name": "name in Telugu script",
  "role": "job title in Telugu",
  "contact": "email | phone | city in Telugu",
  "body": "Complete resume in Telugu script. Sections: వృత్తిపరమైన సారాంశం, పని అనుభవం, విద్య, నైపుణ్యాలు — use • bullets. Translate everything to Telugu."
}`;

    case 'only_tamil':
      return `You are a professional resume writer. Write a resume ENTIRELY in Tamil script. ${jsonRule}

USER DETAILS:
${info}

JSON format (use \\n for newlines):
{
  "name": "name in Tamil script",
  "role": "job title in Tamil",
  "contact": "email | phone | city in Tamil",
  "body": "Complete resume in Tamil script. Sections: தொழில்முறை சுருக்கம், பணி அனுபவம், கல்வி, திறன்கள் — use • bullets. Translate everything to Tamil."
}`;

    case 'only_english':
    default:
      return `You are a professional resume writer. ${jsonRule}

USER DETAILS:
${info}

JSON format (use \\n for newlines):
{
  "name": "full name",
  "role": "job title",
  "contact": "email | phone | location",
  "body": "PROFESSIONAL SUMMARY\\n3-4 compelling sentences.\\n\\nWORK EXPERIENCE\\n• achievement one\\n• achievement two\\n\\nEDUCATION\\ndegree, college, year\\n\\nSKILLS\\nTechnical: list\\nSoft Skills: list"
}`;
  }
}

app.listen(PORT, () => console.log(`✅ ResumeAI backend running on port ${PORT}`));
