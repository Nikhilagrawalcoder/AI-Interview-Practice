import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { GeminiService } from '../services/geminiApi';
import { INTERVIEW_QUESTIONS } from '../utils/constants';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const FileUpload = ({ onFileContent, onQuestionsGenerated, geminiApiKey }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus(null);
    setFileName(file.name);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        // PDF handling
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const typedarray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + '\n';
            }
            
            await processJobDescription(text);
          } catch (error) {
            console.error('Error reading PDF:', error);
            setUploadStatus('error');
            setIsProcessing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type.startsWith('text/')) {
        // Text file handling
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            await processJobDescription(event.target.result);
          } catch (error) {
            console.error('Error reading text file:', error);
            setUploadStatus('error');
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a .txt or .pdf file');
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      setIsProcessing(false);
    }
  };

  const processJobDescription = async (text) => {
    try {
      onFileContent(text);
      
      // Generate questions using Gemini
      if (geminiApiKey) {
        const geminiService = new GeminiService(geminiApiKey);
        const questions = await geminiService.generateQuestions(text);
        onQuestionsGenerated(questions);
        setUploadStatus('success');
      } else {
        // If no API key, use default questions
        onQuestionsGenerated(INTERVIEW_QUESTIONS);
        setUploadStatus('success');
      }
    } catch (error) {
      console.error('Error processing job description:', error);
      setUploadStatus('error');
      // Fallback to default questions
      onQuestionsGenerated(INTERVIEW_QUESTIONS);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    if (isProcessing) return <Loader className="h-4 w-4 animate-spin" />;
    if (uploadStatus === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <Upload className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing job description and generating questions...';
    if (uploadStatus === 'success') return `Successfully processed ${fileName} and generated custom questions!`;
    if (uploadStatus === 'error') return `Error processing ${fileName}. Using default questions.`;
    return 'Upload a job description to generate custom interview questions';
  };

  const getStatusColor = () => {
    if (isProcessing) return 'text-blue-600';
    if (uploadStatus === 'success') return 'text-green-600';
    if (uploadStatus === 'error') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="mb-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <div className="mb-4">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        
        <label className="block mb-2 font-medium text-gray-700">
          Upload Job Description (Optional)
        </label>
        
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
            disabled:opacity-50"
        />
        
        <div className={`mt-3 flex items-center justify-center space-x-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm">{getStatusText()}</span>
        </div>
        
        {!geminiApiKey && (
          <p className="text-xs text-amber-600 mt-2">
            ⚠️ No Gemini API key provided. Custom questions will not be generated.
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;