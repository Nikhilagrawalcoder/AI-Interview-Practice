# PromptMate – AI Interview Assistant

PromptMate is a modern AI-powered interview practice web app built with React and Vite. It helps users prepare for interviews by simulating real interview scenarios, generating custom questions from job descriptions, and providing instant feedback on answers. Users can record their answers, get them transcribed using AssemblyAI, and receive AI-driven feedback. API keys are securely managed and expire after 20 minutes for added security.

---

## ✨ Features

- **AI Interview Chatbot**: Practice interviews in chat or voice mode with professional, context-aware AI responses.
- **Custom Questions from Job Description**: Upload a PDF or TXT job description to generate tailored interview questions using Gemini API.
- **Voice Recording & Transcription**: Record your answers and get them transcribed automatically using AssemblyAI.
- **Feedback System**: Receive constructive, AI-generated feedback on your answers.
- **API Key Security**: Gemini and AssemblyAI API keys are stored locally and expire after 20 minutes.
- **Responsive & Modern UI**: Beautiful, mobile-friendly interface with Tailwind CSS.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Nikhilagrawalcoder/AI-Interview-Practice

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
No API keys are hardcoded. You will be prompted in the app to enter your Gemini and AssemblyAI API keys. These are stored in localStorage and expire after 20 minutes for security.



### 4. Run the App Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Usage

1. **Enter your Gemini API key** when prompted to connect the AI assistant.
2. **Enter your AssemblyAI API key** (in Interview Mode) to enable voice transcription.
3. **Choose Chat or Interview Mode**.
4. **Upload a job description** (PDF or TXT) to generate custom questions, or use default questions.
5. **Record your answers** and get instant AI feedback.
6. **API keys expire after 20 minutes** for security; you will be prompted to re-enter them.

---

## 🌐 Deployment (Netlify)

1. Push your code to GitHub.
2. Go to [Netlify](https://netlify.com/) and connect your GitHub repo.
3. Set build command to `npm run build` and publish directory to `dist`.
4. (Optional) Add environment variables in Netlify dashboard if you want to pre-fill API keys.
5. Deploy and share your live app!

---

## 📁 Project Structure

```
src/
  components/         # React components (Chatbot, InterviewMode, FileUpload, etc.)
  services/           # API and audio service logic
  utils/              # Constants and helpers
  styles/             # Global and component styles
  App.jsx             # Main app entry
  main.jsx            # Vite entry point
```

---

## 🛡️ Security & Privacy
- API keys are stored only in the browser (localStorage) and expire after 20 minutes.
- No keys or user data are sent to any server except Gemini and AssemblyAI APIs.
- Always keep your API keys private and never commit them to version control.

---

## 🙏 Credits
- [Google Gemini API](https://ai.google.dev/)
- [AssemblyAI Speech-to-Text](https://www.assemblyai.com/)
- [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 License
MIT
