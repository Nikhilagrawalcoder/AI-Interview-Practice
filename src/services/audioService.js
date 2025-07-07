let mediaRecorder = null;
let audioChunks = [];
let stream = null;
let currentAudioUrl = null;

// Start recording audio
export const startRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    return true;
  } catch (error) {
    console.error('Error starting recording:', error);
    return false;
  }
};

// Stop recording and return both audio blob and audio URL
export const stopRecording = () => {
  return new Promise((resolve) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Store current audio URL for cleanup
        if (currentAudioUrl) {
          URL.revokeObjectURL(currentAudioUrl);
        }
        currentAudioUrl = audioUrl;

        // Stop mic stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        resolve({ audioUrl, audioBlob });
      };
      mediaRecorder.stop();
    } else {
      resolve(null);
    }
  });
};

// Play recorded audio
export const playAudio = (audioUrl) => {
  const audio = new Audio(audioUrl);
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
  return audio; // Return audio element for control
};

// AssemblyAI transcription process
export const transcribeAudio = async (audioBlob) => {
  // Fixed: Correct environment variable name
  const apiKey = import.meta.env.VITE_ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error('AssemblyAI API key not found. Please set VITE_ASSEMBLYAI_API_KEY in your environment variables.');
  }

  try {
    // 1. Upload the audio to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: apiKey, // Fixed: Should be just the API key
      },
      body: audioBlob,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed with status: ${uploadRes.status}`);
    }

    const uploadData = await uploadRes.json();
    if (!uploadData.upload_url) {
      throw new Error('Audio upload failed - no upload URL received');
    }

    // 2. Start transcription request
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ 
        audio_url: uploadData.upload_url,
        // Optional: Add language detection and other settings
        language_detection: true,
        punctuate: true,
        format_text: true
      }),
    });

    if (!transcriptRes.ok) {
      throw new Error(`Transcription request failed with status: ${transcriptRes.status}`);
    }

    const transcriptData = await transcriptRes.json();
    const transcriptId = transcriptData.id;

    if (!transcriptId) {
      throw new Error('No transcript ID received');
    }

    // 3. Poll for status with better error handling
    let status = transcriptData.status;
    let text = '';
    let retries = 30; // Increased retries for longer audio files
    
    while (status !== 'completed' && status !== 'error' && retries > 0) {
      await new Promise(res => setTimeout(res, 2000)); // Reduced polling interval
      
      const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: apiKey },
      });

      if (!pollingRes.ok) {
        throw new Error(`Polling failed with status: ${pollingRes.status}`);
      }

      const pollingData = await pollingRes.json();
      status = pollingData.status;
      text = pollingData.text;
      retries--;

      console.log(`Transcription status: ${status}`); // Debug logging
    }

    if (status === 'completed') {
      return text;
    } else if (status === 'error') {
      throw new Error('Transcription failed with error status');
    } else {
      throw new Error('Transcription timed out');
    }
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

// Utility function to convert audio blob to different formats if needed
export const convertAudioFormat = (audioBlob) => {
  return new Promise((resolve) => {
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.addEventListener('loadedmetadata', () => {
      // If webm is not supported, you might need to convert to WAV or MP3
      // This is a basic check - you might need more sophisticated conversion
      resolve(audioBlob);
    });
  });
};

// Cleanup function
export const cleanup = () => {
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};