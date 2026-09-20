import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const REGION = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'ap-south-1';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

export const bedrockClient = new BedrockRuntimeClient({
  region: REGION,
});

export function isBedrockConfigured(): boolean {
  return process.env.AI_PROVIDER === 'bedrock' || !!process.env.BEDROCK_ENABLED;
}

/**
 * Invokes Amazon Bedrock with Anthropic Claude 3 / 3.5 model format
 * Enforces structured JSON output and handles JSON parse validation
 */
export async function invokeBedrockJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    temperature: 0.2,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt + '\n\nIMPORTANT: Respond ONLY with valid, raw RFC 8259 JSON. Do not include markdown codeblocks (` ```json `), explanations, or disclaimers.',
          },
        ],
      },
    ],
  };

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: Buffer.from(JSON.stringify(payload)),
  });

  const response = await bedrockClient.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsedResponse = JSON.parse(responseBody);

  const textContent = parsedResponse?.content?.[0]?.text || '';
  // Clean markdown block wrappers if present
  const cleanedJson = textContent.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(cleanedJson) as T;
  } catch (err: any) {
    throw new Error(`Bedrock output was not valid JSON: ${err.message}. Raw output snippet: ${cleanedJson.substring(0, 200)}`);
  }
}
