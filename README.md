# AI-Powered Mathematics Learning Platform

A sophisticated educational platform that combines interactive learning, AI tutoring, and multilingual support to create an engaging mathematics learning experience.

## 🚀 Features

### 1. Interactive Learning Universe
- Visual representation of mathematical concepts using Force-Directed Graph
- Displays connections between different mathematical topics
- Core concepts (Algebra, Calculus, Geometry, Trigonometry) with related sub-topics
- Interactive visualization using react-force-graph
- Dynamic node sizing to distinguish core and sub-topics

### 2. AI-Powered Tutor
- Real-time voice interaction with GPT-4 powered AI tutor
- Audio recording and processing capabilities
- Voice-to-text and text-to-voice conversion
- Contextual responses based on mathematical queries
- Interactive audio feedback system

### 3. Multilingual Support
- Dynamic language switching capability
- Built-in support for English, Spanish, and French
- AI-powered translation system for adding new languages
- Maintains mathematical accuracy across translations
- Cultural context preservation in translations

### 4. Problem Solving Interface
- Interactive problem presentation
- Step-by-step solution input
- Real-time solution marking and feedback
- Support for mathematical equations and expressions
- Markdown and LaTeX rendering for mathematical content

### 5. Personalized Learning
- AI-powered problem recommendations
- Progress tracking
- Focused practice sessions
- Guided learning paths
- Achievement system with audio feedback

## 🛠️ Technologies

### Frontend Framework & UI
- React.js
- Vite (Build tool)
- TailwindCSS (Styling)
- Shadcn/ui (UI Components)
- Lucide React (Icons)

### Mathematics & Visualization
- React Force Graph (Learning Universe visualization)
- KaTeX (Mathematical equation rendering)
- React Markdown (Content formatting)
- Better React MathJax (Mathematical expressions)

### AI & Audio Processing
- OpenAI GPT-4 API Integration
- Web Audio API
- MediaStream Recording
- Audio processing and WAV encoding

### State Management & Utilities
- React Hooks
- Custom service modules
- Environment variable management
- Error boundary implementation

## 🔧 Setup & Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Core Components

### AITutor
- Handles voice interaction with AI
- Real-time audio processing
- Response generation and playback
- Multi-language support

### LearningUniverse
- Interactive graph visualization
- Mathematical concept relationships
- Dynamic node and edge rendering
- User interaction handling

### ProblemPage
- Problem presentation interface
- Solution input and validation
- Feedback generation
- Language switching capability

### MarkdownMath
- Mathematical content rendering
- LaTeX expression support
- Markdown formatting
- Syntax highlighting

## 🔄 Services

### aiTutorService
- Audio recording management
- WAV blob creation
- OpenAI API integration
- Response processing

### translationService
- Multi-language support
- Dynamic translation generation
- Mathematical content preservation
- Cultural context adaptation

## 🧪 Testing

The application includes Jest-based testing:
```bash
npm run test
```

Test files cover:
- Achievement system
- Article text rendering
- Game mechanics
- Dialog components

## 🎨 Styling

- Tailwind CSS for responsive design
- Dark mode optimization
- Custom UI components
- Consistent theme across components
- Animated transitions and interactions

## 🔐 Security

- Environment variable protection
- API key security
- Safe audio processing
- Protected API endpoints

## 🌟 Future Enhancements

1. Additional language support
2. More mathematical topics
3. Enhanced visualization options
4. Expanded problem database
5. Advanced progress tracking
6. Collaborative learning features
7. Offline support
8. Mobile optimization

