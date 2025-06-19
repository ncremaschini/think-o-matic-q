import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { fromIni } from '@aws-sdk/credential-providers';
import { Workshop } from '../types/workshop';

interface AnalysisResponse {
  summary: {
    brief: string;
    detailed: string;
  };
  sentiment: {
    overall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    score: number;
    explanation: string;
  };
  participation: {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    evidence: string;
  };
  actionItems: Array<{
    task: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'Technical' | 'Process' | 'Research' | 'Other';
  }>;
  keyThemes: Array<{
    theme: string;
    frequency: number;
    context: string;
  }>;
  recommendations: string[];
}

export class BedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'eu-west-1',
      credentials: fromIni({ profile: process.env.AWS_PROFILE_NAME || 'default' })
    });
  }

  private buildAgendaPrompt(workshop: Workshop): string {
    return `Create a detailed workshop agenda for the following workshop:

Title: ${workshop.title}
Goal: ${workshop.goal}
Type: ${workshop.type}
Expected Outcomes: ${workshop.expectedOutcomes}
Duration: ${workshop.duration} minutes
Participants: ${workshop.participantCount} people (${workshop.participantTypes})
Date: ${workshop.dateTime}

Please create a structured agenda that includes:
1. Welcome and introductions
2. Goal setting and context
3. Main activities appropriate for a ${workshop.type} workshop
4. Break times (if duration > 90 minutes)
5. Wrap-up and next steps

Format the response as a clear, time-based agenda with specific time allocations for each section. Make it practical and actionable.`;
  }

  private buildAnalysisPrompt(miroContent: string): string {
    return `Analyze the following workshop content from a Miro board and provide a comprehensive analysis. The content includes sticky notes, text items, and shapes with text, organized by sections.

Workshop Content:
${miroContent}

Please provide a detailed analysis in JSON format with the following structure:

{
  "summary": {
    "brief": "A concise 2-3 sentence summary of the workshop outcomes",
    "detailed": "A more detailed paragraph explaining the key discussions and decisions"
  },
  "sentiment": {
    "overall": "POSITIVE/NEUTRAL/NEGATIVE",
    "score": 1-5 (1 being very negative, 5 being very positive),
    "explanation": "Brief explanation of the sentiment analysis"
  },
  "participation": {
    "level": "HIGH/MEDIUM/LOW",
    "evidence": "Evidence of participation level from the content"
  },
  "actionItems": [
    {
      "task": "Specific action item",
      "priority": "HIGH/MEDIUM/LOW",
      "category": "Technical/Process/Research/Other"
    }
  ],
  "keyThemes": [
    {
      "theme": "Main theme or topic identified",
      "frequency": "Number of times this theme appeared",
      "context": "Brief explanation of the theme's context"
    }
  ],
  "recommendations": [
    "Specific recommendation for follow-up or improvement"
  ]
}

Focus on extracting actionable insights and clear patterns from the workshop content. Pay special attention to:
1. Recurring themes or topics
2. Clear action items or tasks mentioned
3. The general tone and engagement level
4. Specific decisions or conclusions reached
5. Areas of agreement or disagreement

If certain sections are empty or unclear, provide appropriate placeholder values with explanations.`;
  }

  async generateAgenda(workshop: Workshop): Promise<string> {
    const prompt = this.buildAgendaPrompt(workshop);
    
    try {
      const inferenceProfile = process.env.AWS_BEDROCK_INFERENCE_PROFILE;
      
      if (!inferenceProfile) {
        throw new Error('Bedrock inference profile not configured');
      }

      console.log('🤖 Generating agenda using Bedrock...');
      console.log('🔑 Using Inference Profile as Model ID:', inferenceProfile);
      
      const command = new InvokeModelCommand({
        modelId: inferenceProfile,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      console.log('✅ Agenda generated successfully');
      
      // Handle different response formats
      if (responseBody.output && responseBody.output.message && responseBody.output.message.content) {
        return responseBody.output.message.content[0].text;
      } else if (responseBody.messages && responseBody.messages[0]) {
        return responseBody.messages[0].content[0].text;
      } else if (responseBody.content && responseBody.content[0]) {
        return responseBody.content[0].text;
      } else if (responseBody.text) {
        return responseBody.text;
      } else {
        throw new Error('Unexpected response format from Bedrock');
      }
    } catch (error) {
      console.error('Error generating agenda with Bedrock:', error);
      throw new Error('Failed to generate workshop agenda');
    }
  }

  async analyzeWorkshop(miroContent: string): Promise<AnalysisResponse> {
    const prompt = this.buildAnalysisPrompt(miroContent);
    
    try {
      const inferenceProfile = process.env.AWS_BEDROCK_INFERENCE_PROFILE;
      
      if (!inferenceProfile) {
        throw new Error('Bedrock inference profile not configured');
      }

      console.log('🔍 Analyzing workshop content with Bedrock...');
      console.log(`📊 Content length: ${miroContent.length} characters`);

      const command = new InvokeModelCommand({
        modelId: inferenceProfile,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      console.log('✅ Analysis completed');
      
      // Handle different response formats
      let analysisText;
      if (responseBody.output && responseBody.output.message && responseBody.output.message.content) {
        analysisText = responseBody.output.message.content[0].text;
      } else if (responseBody.messages && responseBody.messages[0]) {
        analysisText = responseBody.messages[0].content[0].text;
      } else if (responseBody.content && responseBody.content[0]) {
        analysisText = responseBody.content[0].text;
      } else if (responseBody.text) {
        analysisText = responseBody.text;
      } else {
        throw new Error('Unexpected response format from Bedrock');
      }

      console.log('📋 Raw analysis response:', analysisText.substring(0, 200) + '...');

      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error('Error analyzing workshop with Bedrock:', error);
      throw new Error('Failed to analyze workshop content');
    }
  }

  private parseAnalysisResponse(response: string): AnalysisResponse {
    try {
      // Clean up the response - remove markdown formatting and extract JSON
      let cleanResponse = response;
      
      // Remove markdown code blocks
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON content between braces
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
      
      console.log('🧹 Cleaned response for parsing:', cleanResponse.substring(0, 200) + '...');
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanResponse);
      
      // Validate required fields and provide defaults if needed
      const analysis: AnalysisResponse = {
        summary: {
          brief: parsed.summary?.brief || 'Brief summary not available',
          detailed: parsed.summary?.detailed || 'Detailed summary not available'
        },
        sentiment: {
          overall: (parsed.sentiment?.overall || 'NEUTRAL') as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
          score: parsed.sentiment?.score || 3,
          explanation: parsed.sentiment?.explanation || 'Sentiment analysis not available'
        },
        participation: {
          level: (parsed.participation?.level || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
          evidence: parsed.participation?.evidence || 'Participation evidence not available'
        },
        actionItems: (parsed.actionItems || []).map((item: any) => ({
          task: item.task || 'Undefined task',
          priority: (item.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
          category: (item.category || 'Other') as 'Technical' | 'Process' | 'Research' | 'Other'
        })),
        keyThemes: (parsed.keyThemes || []).map((theme: any) => ({
          theme: theme.theme || 'Undefined theme',
          frequency: theme.frequency || 1,
          context: theme.context || 'Context not available'
        })),
        recommendations: parsed.recommendations || ['No specific recommendations provided']
      };

      console.log('✅ Analysis parsed successfully');
      console.log(`📊 Found ${analysis.actionItems.length} action items and ${analysis.keyThemes.length} key themes`);
      
      return analysis;
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      console.log('Raw response:', response.substring(0, 500) + '...');
      
      // Provide a fallback analysis
      return {
        summary: {
          brief: 'Analysis parsing failed - see raw content',
          detailed: 'The workshop content could not be automatically analyzed. Please review the raw content manually.'
        },
        sentiment: {
          overall: 'NEUTRAL',
          score: 3,
          explanation: 'Sentiment analysis failed - manual review needed'
        },
        participation: {
          level: 'MEDIUM',
          evidence: 'Participation analysis failed - manual review needed'
        },
        actionItems: [{
          task: 'Review workshop content manually',
          priority: 'HIGH',
          category: 'Process'
        }],
        keyThemes: [{
          theme: 'Analysis Failed',
          frequency: 1,
          context: 'Automatic analysis failed - manual review needed'
        }],
        recommendations: ['Perform manual analysis of the workshop content']
      };
    }
  }
}
