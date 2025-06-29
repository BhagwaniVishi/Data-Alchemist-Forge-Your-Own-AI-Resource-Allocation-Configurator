// AI Configuration for Data Alchemist
// This file manages LLM provider settings and API keys

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

// Get AI configuration from environment variables
export function getAIConfig(): AIConfig {
  const provider = (process.env.NEXT_PUBLIC_DEFAULT_LLM_PROVIDER as 'openai' | 'anthropic' | 'custom') || 'openai';
  
  switch (provider) {
    case 'openai':
      return {
        provider: 'openai',
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        model: process.env.NEXT_PUBLIC_DEFAULT_LLM_MODEL || 'gpt-4',
      };
    
    case 'anthropic':
      return {
        provider: 'anthropic',
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
        model: process.env.NEXT_PUBLIC_DEFAULT_LLM_MODEL || 'claude-3-sonnet-20240229',
      };
    
    case 'custom':
      return {
        provider: 'custom',
        apiKey: process.env.NEXT_PUBLIC_CUSTOM_LLM_API_KEY || '',
        model: process.env.NEXT_PUBLIC_DEFAULT_LLM_MODEL || 'custom-model',
        baseUrl: process.env.NEXT_PUBLIC_CUSTOM_LLM_BASE_URL,
      };
    
    default:
      return {
        provider: 'openai',
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        model: 'gpt-4',
      };
  }
}

// Check if AI services are properly configured
export function isAIConfigured(): boolean {
  const config = getAIConfig();
  return !!config.apiKey;
}

// Get configuration status for UI display
export function getAIConfigStatus(): {
  configured: boolean;
  provider: string;
  model: string;
  message: string;
} {
  const config = getAIConfig();
  const configured = isAIConfigured();
  
  return {
    configured,
    provider: config.provider,
    model: config.model,
    message: configured 
      ? `AI services configured with ${config.provider} (${config.model})`
      : `AI services not configured. Please add API key for ${config.provider}.`
  };
} 