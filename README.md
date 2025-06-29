# Data Alchemist - AI Resource Allocation Configurator

A powerful web application that transforms raw data into structured, validated, and optimized datasets through an intuitive wizard interface. Data Alchemist leverages AI-powered features to intelligently process, validate, and enhance your data with minimal manual intervention.

## 🚀 Features

### Core Functionality
- **Multi-format File Upload**: Support for CSV, Excel, and JSON files
- **Interactive Data Preview**: Real-time data visualization and editing
- **Advanced Rule Builder**: Create custom validation and transformation rules
- **Data Prioritization**: Intelligent resource allocation based on business rules
- **Export Capabilities**: Generate optimized datasets in multiple formats

### 🤖 AI-Powered Features (Stretch Goals)

#### 1. **Natural Language Data Modification**
- Describe data changes in plain English
- Examples: "Capitalize all names", "Format phone numbers", "Replace 'old' with 'new'"
- AI interprets your instructions and applies transformations automatically
- Preview changes before applying them to your data

#### 2. **AI Error Detection & Correction**
- Automatic detection of data inconsistencies and errors
- Smart suggestions for data corrections
- Confidence scoring for each correction
- Support for format, spelling, standardization, and validation corrections
- Apply corrections individually or in bulk

#### 3. **AI Rule Recommendations**
- Intelligent analysis of your data structure
- Automatic generation of validation and transformation rules
- Categorized recommendations (validation, transformation, formatting, business)
- Confidence scoring and detailed explanations
- Examples and rule definitions for each recommendation

#### 4. **AI-Based Data Validation**
- Intelligent validation using AI analysis
- Context-aware error detection
- Smart suggestions for data improvements
- Real-time validation feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Styling**: Tailwind CSS v3
- **File Processing**: PapaParse, XLSX
- **AI Integration**: OpenAI, Anthropic, Custom LLM APIs
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18.18.0 or higher
- npm or yarn package manager
- Git
- (Optional) API keys for AI services (OpenAI, Anthropic, or custom endpoints)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BhagwaniVishi/Data-Alchemist-Forge-Your-Own-AI-Resource-Allocation-Configurator.git
cd Data-Alchemist-Forge-Your-Own-AI-Resource-Allocation-Configurator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure AI Services (Optional)

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_MODEL=gpt-4

# Anthropic Configuration
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Custom AI Service Configuration
NEXT_PUBLIC_CUSTOM_API_KEY=your_custom_api_key
NEXT_PUBLIC_CUSTOM_API_ENDPOINT=https://your-api.com/ai
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How to Use

### Step 1: Upload Your Data
- Click "Upload Files" to select your data files
- Supported formats: CSV, Excel (.xlsx, .xls), JSON
- Drag and drop files or use the file picker
- The system automatically detects file structure and content

### Step 2: Review Your Data
- Preview uploaded files in a structured table format
- Verify data integrity and structure
- Identify any potential issues with real-time validation

### Step 3: AI-Powered Data Enhancement

#### Natural Language Modification
- Type instructions like "Capitalize all names" or "Format phone numbers"
- AI processes your request and shows preview of changes
- Apply modifications individually or to all matching data

#### AI Error Correction
- Click "Detect Errors" to find data inconsistencies
- Review suggested corrections with confidence scores
- Apply corrections individually or all at once
- View detailed explanations for each correction

#### AI Rule Recommendations
- Click "Generate Recommendations" to get AI-powered rule suggestions
- Review categorized recommendations (validation, transformation, formatting, business)
- See confidence scores and detailed rule definitions
- Apply recommended rules to your data

### Step 4: Manual Rule Builder
- Create custom validation and transformation rules
- Define data processing logic
- Set up error handling and fallbacks

### Step 5: Prioritize and Export
- Configure resource allocation priorities
- Set importance levels for different data categories
- Export optimized datasets in multiple formats
- Generate configuration files for deployment

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── wizard/           # Wizard interface components
│       ├── FileUploadStep.tsx
│       ├── DataReviewStep.tsx
│       ├── RuleBuilderStep.tsx
│       ├── PrioritizationStep.tsx
│       ├── AIErrorCorrection.tsx
│       ├── NaturalLanguageModification.tsx
│       ├── AIRuleRecommendations.tsx
│       ├── ValidatorPanel.tsx
│       └── WizardLayout.tsx
├── store/                # State management
│   └── wizardStore.ts    # Zustand store
├── utils/                # Utility functions
│   ├── parseFiles.ts     # File parsing utilities
│   ├── validateTables.ts # Data validation utilities
│   └── aiServices.ts     # AI integration services
└── config/               # Configuration files
    └── aiConfig.ts       # AI service configuration
```

## 🤖 AI Configuration

### Supported AI Providers

#### OpenAI
```typescript
const config = {
  provider: 'openai',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.3
};
```

#### Anthropic
```typescript
const config = {
  provider: 'anthropic',
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  temperature: 0.3
};
```

#### Custom API
```typescript
const config = {
  provider: 'custom',
  endpoint: 'https://your-api.com/ai',
  apiKey: process.env.NEXT_PUBLIC_CUSTOM_API_KEY,
  model: 'your-model'
};
```

### AI Features in Detail

#### Natural Language Modification Examples
- **Text Transformations**: "Capitalize all names", "Convert to lowercase", "Trim whitespace"
- **Format Standardization**: "Format phone numbers as (XXX) XXX-XXXX", "Standardize email format"
- **Data Replacement**: "Replace 'old' with 'new'", "Change 'USA' to 'United States'"
- **Custom Instructions**: Any natural language description of data changes

#### AI Error Correction Types
- **Format Corrections**: Email format, phone number format, date format
- **Spelling Corrections**: Common typos and misspellings
- **Standardization**: Consistent formatting across data
- **Validation**: Data range and type validation

#### AI Rule Recommendations Categories
- **Validation Rules**: Data integrity and format validation
- **Transformation Rules**: Data conversion and formatting
- **Formatting Rules**: Consistent presentation standards
- **Business Rules**: Domain-specific logic and constraints

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Service Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_CUSTOM_API_KEY=your_custom_key
NEXT_PUBLIC_CUSTOM_API_ENDPOINT=your_endpoint

# Application Configuration
NEXT_PUBLIC_APP_NAME=Data Alchemist
```

### Build Configuration

The application uses the following build configuration:

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v3 with PostCSS
- **Type Checking**: TypeScript with strict mode
- **Linting**: ESLint with Next.js configuration
- **AI Integration**: Multi-provider support with fallback mechanisms

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel will automatically detect Next.js and deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components for consistency
- Write unit tests for new features
- Update documentation for API changes
- Ensure AI features work with proper error handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/BhagwaniVishi/Data-Alchemist-Forge-Your-Own-AI-Resource-Allocation-Configurator/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Specify your AI service configuration if relevant

## 🔄 Version History

- **v1.0.0**: Initial release with wizard interface and file processing
- **v1.1.0**: Added data validation and rule builder
- **v1.2.0**: Enhanced UI with Material-UI components
- **v1.3.0**: Implemented AI stretch goals
  - Natural language data modification
  - AI error detection and correction
  - AI rule recommendations
  - AI-based data validation
- **v1.4.0**: Multi-provider AI integration and deployment optimization

## 🎯 AI Stretch Goals Status

All AI stretch goals have been successfully implemented:

- ✅ **Natural Language Modification**: Users can describe data changes in plain English
- ✅ **AI Error Correction**: Automatic detection and suggestion of data fixes
- ✅ **AI Rule Recommendations**: Intelligent suggestions for validation rules
- ✅ **AI-based Validator**: AI-powered data validation and analysis

The application now provides a comprehensive AI-powered data processing experience with multiple AI service providers and robust error handling.

---

**Built with ❤️ using Next.js, Material-UI, and AI-powered intelligence**
