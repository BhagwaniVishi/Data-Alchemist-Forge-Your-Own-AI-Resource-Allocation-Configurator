# Data Alchemist - AI Resource Allocation Configurator

A powerful web application that helps you configure and optimize AI resource allocation through an intuitive wizard interface. Data Alchemist transforms complex data processing workflows into streamlined, AI-powered solutions.

## 🚀 Features

- **File Upload & Processing**: Support for CSV, Excel, and JSON files
- **Interactive Wizard Interface**: Step-by-step configuration process
- **Data Validation**: Built-in validation rules and error checking
- **Priority Management**: Set and manage resource allocation priorities
- **Rule Builder**: Create custom validation and processing rules
- **Real-time Preview**: See changes as you configure your workflow
- **Modern UI**: Built with Material-UI and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand
- **File Processing**: PapaParse, XLSX
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18.18.0 or higher
- npm or yarn package manager
- Git

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

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

### 4. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How to Use

### Step 1: Upload Your Data
- Click "Upload Files" to select your data files
- Supported formats: CSV, Excel (.xlsx, .xls), JSON
- Drag and drop files or use the file picker

### Step 2: Review Your Data
- Preview uploaded files in a structured table format
- Verify data integrity and structure
- Identify any potential issues

### Step 3: Set Priorities
- Configure resource allocation priorities
- Define importance levels for different data categories
- Set processing order and resource limits

### Step 4: Build Rules
- Create custom validation rules
- Define data transformation logic
- Set up error handling and fallbacks

### Step 5: Validate & Deploy
- Review your complete configuration
- Run validation tests
- Deploy your AI resource allocation setup

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── wizard/           # Wizard interface components
│       ├── DataReviewStep.tsx
│       ├── FileUploadStep.tsx
│       ├── PrioritizationStep.tsx
│       ├── RuleBuilderStep.tsx
│       ├── ValidatorPanel.tsx
│       └── WizardLayout.tsx
├── store/                # State management
│   └── wizardStore.ts    # Zustand store
└── utils/                # Utility functions
    ├── parseFiles.ts     # File parsing utilities
    └── validateTables.ts # Data validation utilities
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory for any environment-specific configurations:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_NAME=Data Alchemist
```

### Build Configuration

The application uses the following build configuration:

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v3 with PostCSS
- **Type Checking**: TypeScript
- **Linting**: ESLint with Next.js configuration

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/BhagwaniVishi/Data-Alchemist-Forge-Your-Own-AI-Resource-Allocation-Configurator/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔄 Version History

- **v1.0.0**: Initial release with wizard interface and file processing
- **v1.1.0**: Added data validation and rule builder
- **v1.2.0**: Enhanced UI with Material-UI components

---

**Built with ❤️ using Next.js and Material-UI**
