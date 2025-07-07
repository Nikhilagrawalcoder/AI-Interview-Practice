import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Trash2 } from 'lucide-react';
import { startRecording, stopRecording, transcribeAudio, cleanup } from '../services/audioService';

const VoiceRecorder = ({ onSubmitAnswer, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // Store the blob separately
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  
  const audioRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      setError(''); // Clear any previous errors
      const success = await startRecording();
      if (success) {
        setIsRecording(true);
        setRecordedAudio(null);
        setAudioBlob(null);
        setTranscription('');
      } else {
        setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      }
    } catch (err) {
      setError('Failed to start recording. Please try again.');
      console.error('Recording start error:', err);
    }
  };

  const handleStopRecording = async () => {
    try {
      setError('');
      const result = await stopRecording();
      if (result) {
        const { audioUrl, audioBlob } = result;
        setRecordedAudio(audioUrl);
        setAudioBlob(audioBlob);
        setIsRecording(false);
        
        // Auto-transcribe
        setIsTranscribing(true);
        try {
          const transcriptionText = await transcribeAudio(audioBlob);
          setTranscription(transcriptionText);
        } catch (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
          setError('Error transcribing audio. Please try again or type your answer manually.');
          setTranscription(''); // Clear transcription on error
        }
        setIsTranscribing(false);
      } else {
        setError('Failed to stop recording. Please try again.');
      }
    } catch (err) {
      setError('Error stopping recording. Please try again.');
      setIsTranscribing(false);
      console.error('Recording stop error:', err);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setError('Error playing audio. Please try again.');
        });
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setRecordedAudio(null);
    setAudioBlob(null);
    setTranscription('');
    setIsPlaying(false);
    setError('');
  };

  const handleSubmit = () => {
    if (transcription.trim()) {
      onSubmitAnswer(transcription, recordedAudio);
      setRecordedAudio(null);
      setAudioBlob(null);
      setTranscription('');
      setError('');
    }
  };

  const handleTranscriptionEdit = (e) => {
    setTranscription(e.target.value);
  };

  const retryTranscription = async () => {
    if (audioBlob) {
      setIsTranscribing(true);
      setError('');
      try {
        const transcriptionText = await transcribeAudio(audioBlob);
        setTranscription(transcriptionText);
      } catch (transcriptionError) {
        console.error('Transcription retry error:', transcriptionError);
        setError('Transcription failed again. Please type your answer manually.');
      }
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
          {error.includes('transcrib') && audioBlob && (
            <button
              onClick={retryTranscription}
              className="mt-2 text-red-600 hover:text-red-800 underline"
              disabled={isTranscribing}
            >
              {isTranscribing ? 'Retrying...' : 'Retry Transcription'}
            </button>
          )}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isTranscribing}
          className={`flex items-center px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </>
          )}
        </button>
        
        {recordedAudio && (
          <>
            <button
              onClick={playRecording}
              disabled={isTranscribing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </button>
            
            <button
              onClick={deleteRecording}
              disabled={isTranscribing}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
            <p className="text-red-800 font-medium">Recording in progress...</p>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {recordedAudio && (
        <audio
          ref={audioRef}
          src={recordedAudio}
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Audio playback error:', e);
            setError('Error with audio playback.');
          }}
          className="hidden"
        />
      )}

      {/* Transcription Status */}
      {isTranscribing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
            <p className="text-blue-800">Transcribing your answer...</p>
          </div>
        </div>
      )}

      {/* Transcription Display and Edit */}
      {transcription && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer (You can edit this before submitting):
          </label>
          <textarea
            value={transcription}
            onChange={handleTranscriptionEdit}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="6"
            placeholder="Your transcribed answer will appear here..."
          />
        </div>
      )}

      {/* Manual Input Option */}
      {recordedAudio && !transcription && !isTranscribing && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800 mb-2">Having trouble with transcription? You can type your answer manually:</p>
          <textarea
            value={transcription}
            onChange={handleTranscriptionEdit}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="6"
            placeholder="Type your answer here..."
          />
        </div>
      )}

      {/* Submit Button */}
      {(transcription || (recordedAudio && !isTranscribing)) && (
        <button
          onClick={handleSubmit}
          disabled={isLoading || !transcription.trim()}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Getting AI Feedback...' : 'Submit Answer & Get Feedback'}
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;