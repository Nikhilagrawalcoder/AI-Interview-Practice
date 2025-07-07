# PromptMate - AI Interview Assistant

A powerful AI-driven interview practice application that helps you prepare for job interviews with personalized questions and real-time feedback.

## Features

### 🎯 **Dual Mode Interface**
- **Chat Mode**: Interactive conversation with AI for interview tips and general questions
- **Interview Mode**: Structured practice sessions with voice recording and AI feedback

### 🎤 **Voice Recording & Transcription**
- Record your interview answers with high-quality audio
- Automatic speech-to-text transcription using AssemblyAI
- Play back your recordings to review your responses
- Manual transcription editing capabilities

### 📄 **Custom Question Generation**
- Upload job descriptions to generate tailored interview questions
- AI-powered question generation using Google's Gemini API
- Fallback to default interview questions if needed
- Visual indicators for custom vs. default questions

### 🤖 **AI-Powered Feedback**
- Detailed feedback on your interview responses
- Constructive suggestions for improvement
- Professional interview coaching guidance
- STAR method recommendations

### 🔐 **Secure API Key Management**
- Local storage of API keys with 20-minute expiration
- Secure handling of sensitive credentials
- Easy API key setup and management interface

## Prerequisites

Before using PromptMate, you'll need:

1. **Google Gemini API Key** (Required)
   - Get your API key from [Google AI Studio](https://aistudio.google.com/)
   - Used for AI responses and custom question generation

2. **AssemblyAI API Key** (Optional but recommended)
   - Get your API key from [AssemblyAI](https://www.assemblyai.com/)
   - Required for automatic speech-to-text transcription
   - Without this, you'll need to manually type your answers

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nikhilagrawalcoder/AI-Interview-Practice
cd AI-Interview-Practice
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Initial Setup
1. When you first open the application, you'll be prompted to enter your Gemini API key
2. The app will test the connection and confirm successful setup
3. You can optionally add your AssemblyAI API key for voice transcription

### Chat Mode
1. Click "Chat Mode" to start an interactive conversation
2. Ask questions about interview preparation, career advice, or practice responses
3. Get professional, interview-focused guidance from the AI

### Interview Mode
1. Click "Interview Mode" to start a structured practice session
2. **Optional**: Upload a job description file to generate custom questions
3. **Record**: Use the voice recorder to capture your responses
4. **Review**: Listen to your recording and edit the transcription if needed
5. **Feedback**: Receive detailed AI feedback on your answer
6. **Progress**: Continue through all questions and track your improvement

### File Upload Support
- **PDF files**: Job descriptions, requirements documents
- **Word documents**: .docx files with job details
- **Text files**: Plain text job descriptions
- **Images**: Job posting screenshots (OCR processing)

## Project Structure

```
src/
├── components/
│   ├── ApikeySetup.jsx          # API key configuration
│   ├── ChatMode.jsx             # Chat interface component
│   ├── InterviewMode.jsx        # Interview practice interface
│   ├── MessageList.jsx          # Message display component
│   ├── VoiceRecorder.jsx        # Audio recording functionality
│   ├── FileUpload.jsx           # File upload and processing
│   └── InterviewChatbot.jsx     # Main application component
├── services/
│   ├── geminiApi.js            # Gemini API integration
│   └── audioService.js         # Audio recording and transcription
├── utils/
│   ├── constants.js            # Application constants
│   └── helpers.js              # Utility functions
└── App.js                      # Application entry point
```

## API Integrations

### Google Gemini API
- **Purpose**: AI responses and custom question generation
- **Model**: gemini-2.5-flash
- **Features**: 
  - Natural language processing
  - Context-aware responses
  - Job description analysis

### AssemblyAI API
- **Purpose**: Speech-to-text transcription
- **Features**:
  - High accuracy transcription
  - Language detection
  - Punctuation and formatting
  - Real-time processing

## Technologies Used

- **Frontend**: React 18+ with modern hooks
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **Audio**: Web Audio API, MediaRecorder API
- **File Processing**: Built-in file readers
- **State Management**: React useState and useEffect

## Features in Detail

### Smart Question Generation
- Analyzes job descriptions to create relevant questions
- Considers role requirements, skills, and responsibilities
- Generates 10 tailored questions per job description
- Maintains question quality with fallback mechanisms

### Advanced Voice Recording
- Cross-browser compatible audio recording
- Automatic microphone permission handling
- Real-time recording status indicators
- Audio playback controls with pause/resume

### Intelligent Feedback System
- Analyzes response content and structure
- Provides specific improvement suggestions
- Recommends STAR method implementation
- Offers professional interview coaching tips

### Responsive Design
- Modern, professional interface
- Mobile-friendly responsive layout
- Accessible color schemes and typography
- Smooth animations and transitions

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
REACT_APP_ASSEMBLYAI_API_URL=https://api.assemblyai.com/v2
```

### API Key Security
- API keys are stored locally with automatic expiration
- Keys are never transmitted to external servers (except official APIs)
- 20-minute session timeout for security
- Easy key rotation and management

## Troubleshooting

### Common Issues

**Audio Recording Not Working**
- Ensure microphone permissions are granted
- Check browser compatibility (Chrome, Firefox, Safari supported)
- Verify secure context (HTTPS or localhost)

**Transcription Errors**
- Verify AssemblyAI API key is valid and active
- Check internet connection stability
- Ensure audio quality is sufficient

**API Connection Issues**
- Verify Gemini API key is valid
- Check API quotas and usage limits
- Ensure proper network connectivity

**File Upload Problems**
- Verify file size limits (max 10MB)
- Check supported file formats
- Ensure file is not corrupted

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

### Upcoming Features
- [ ] Video interview practice mode
- [ ] Interview performance analytics
- [ ] Multiple language support
- [ ] Interview question difficulty levels
- [ ] Export interview reports
- [ ] Integration with job boards
- [ ] Mock interview scheduling
- [ ] Interview tips and resources library

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added custom question generation
- **v1.2.0**: Enhanced voice recording and transcription
- **v1.3.0**: Improved UI/UX and mobile support

---

**Made with ❤️ for interview success**