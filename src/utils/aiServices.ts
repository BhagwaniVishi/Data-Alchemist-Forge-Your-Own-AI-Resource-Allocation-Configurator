// AI Services for Data Alchemist
// Handles integration with various LLM APIs for AI-powered features

export interface ErrorCorrection {
  field: string;
  originalValue: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
  correctionType: 'format' | 'spelling' | 'standardization' | 'validation';
}

export interface RuleRecommendation {
  id: string;
  name: string;
  description: string;
  category: 'validation' | 'transformation' | 'formatting' | 'business';
  confidence: number;
  ruleDefinition: string;
  examples: string[];
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  model?: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
}

// Default AI configuration
export const defaultAIConfig: AIConfig = {
  provider: 'openai',
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.3
};

// AI Service class for handling different providers
class AIService {
  private config: AIConfig;

  constructor(config: AIConfig = defaultAIConfig) {
    this.config = { ...defaultAIConfig, ...config };
  }

  // Generic method to call AI API
  private async callAI(prompt: string): Promise<string> {
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(prompt);
        case 'anthropic':
          return await this.callAnthropic(prompt);
        case 'custom':
          return await this.callCustomAPI(prompt);
        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      throw new Error('Failed to communicate with AI service');
    }
  }

  // OpenAI API integration
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  // Anthropic API integration
  private async callAnthropic(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  // Custom API integration
  private async callCustomAPI(prompt: string): Promise<string> {
    if (!this.config.endpoint) {
      throw new Error('Custom API endpoint not configured');
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify({
        prompt,
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || data.content || '';
  }

  // AI-powered error detection and correction
  async detectErrors(data: Record<string, unknown>[]): Promise<ErrorCorrection[]> {
    const prompt = `Analyze the following data for potential errors and suggest corrections. Return the response as a JSON array of error corrections.

Data: ${JSON.stringify(data, null, 2)}

For each error found, provide:
- field: the field name
- originalValue: the current value
- suggestedValue: the corrected value
- confidence: confidence level (0-1)
- reason: explanation of the error
- correctionType: one of 'format', 'spelling', 'standardization', 'validation'

Focus on:
- Format inconsistencies (emails, phone numbers, dates)
- Spelling errors
- Data standardization issues
- Validation failures

Return only valid JSON.`;

    try {
      const response = await this.callAI(prompt);
      const corrections = JSON.parse(response);
      return Array.isArray(corrections) ? corrections : [];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  }

  // AI-powered rule recommendations
  async recommendRules(data: Record<string, unknown>[]): Promise<RuleRecommendation[]> {
    const prompt = `Analyze the following data and recommend validation and transformation rules. Return the response as a JSON array of rule recommendations.

Data: ${JSON.stringify(data, null, 2)}

For each rule recommendation, provide:
- id: unique identifier
- name: descriptive name
- description: what the rule does
- category: one of 'validation', 'transformation', 'formatting', 'business'
- confidence: confidence level (0-1)
- ruleDefinition: the actual rule logic
- examples: array of example applications

Focus on:
- Data validation rules
- Format standardization
- Business logic rules
- Data transformation patterns

Return only valid JSON.`;

    try {
      const response = await this.callAI(prompt);
      const recommendations = JSON.parse(response);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  }

  // AI-powered natural language data modification
  async processNaturalLanguageInstruction(instruction: string, data: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const prompt = `Apply the following instruction to the data and return the modified data as JSON.

Instruction: ${instruction}

Original Data: ${JSON.stringify(data, null, 2)}

Return the modified data as a JSON array with the same structure as the original data.`;

    try {
      const response = await this.callAI(prompt);
      const modifiedData = JSON.parse(response);
      return Array.isArray(modifiedData) ? modifiedData : data;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return data;
    }
  }

  // AI-powered data validation
  async validateData(data: Record<string, unknown>[], rules: Record<string, unknown>[]): Promise<Array<{ field: string; value: unknown; error: string; severity: 'error' | 'warning' | 'info' }>> {
    const prompt = `Validate the following data against the provided rules and return validation results as JSON.

Data: ${JSON.stringify(data, null, 2)}

Rules: ${JSON.stringify(rules, null, 2)}

For each validation issue found, provide:
- field: the field name
- value: the current value
- error: description of the validation error
- severity: one of 'error', 'warning', 'info'

Return only valid JSON.`;

    try {
      const response = await this.callAI(prompt);
      const validationResults = JSON.parse(response);
      return Array.isArray(validationResults) ? validationResults : [];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  }

  // AI-powered data analysis and insights
  async analyzeData(data: Record<string, unknown>[]): Promise<{ insights: string[]; patterns: string[]; recommendations: string[] }> {
    const prompt = `Analyze the following data and provide insights, patterns, and recommendations. Return the response as JSON.

Data: ${JSON.stringify(data, null, 2)}

Return a JSON object with:
- insights: array of data insights
- patterns: array of identified patterns
- recommendations: array of improvement recommendations

Return only valid JSON.`;

    try {
      const response = await this.callAI(prompt);
      const analysis = JSON.parse(response);
      return {
        insights: analysis.insights || [],
        patterns: analysis.patterns || [],
        recommendations: analysis.recommendations || []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        insights: [],
        patterns: [],
        recommendations: []
      };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export individual functions for convenience
export const detectErrors = (data: Record<string, unknown>[]) => aiService.detectErrors(data);
export const recommendRules = (data: Record<string, unknown>[]) => aiService.recommendRules(data);
export const processNaturalLanguageInstruction = (instruction: string, data: Record<string, unknown>[]) => 
  aiService.processNaturalLanguageInstruction(instruction, data);
export const validateData = (data: Record<string, unknown>[], rules: Record<string, unknown>[]) => 
  aiService.validateData(data, rules);
export const analyzeData = (data: Record<string, unknown>[]) => aiService.analyzeData(data);

// Export the service class for advanced usage
export { AIService }; 