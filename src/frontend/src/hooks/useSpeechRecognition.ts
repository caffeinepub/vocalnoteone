import { useState, useEffect, useRef, useCallback } from 'react';

// Browser speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string>('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const isStoppingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);

  // Initialize recognition once on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      
      // Process results from the last result index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Append final result to the committed transcript
          finalTranscriptRef.current += transcriptPiece + ' ';
        } else {
          // Accumulate interim results
          interimTranscript += transcriptPiece;
        }
      }

      // Update display: committed final + current interim
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle different error types
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
        setIsListening(false);
        isStoppingRef.current = false;
        isStartingRef.current = false;
      } else if (event.error === 'no-speech') {
        // No speech detected - this is normal, don't stop
        return;
      } else if (event.error === 'aborted') {
        // User aborted - this is expected when stopping
        return;
      } else if (event.error === 'network') {
        setError('Network error. Speech recognition may require an internet connection.');
        setIsListening(false);
        isStoppingRef.current = false;
        isStartingRef.current = false;
      } else {
        // Other errors
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        isStoppingRef.current = false;
        isStartingRef.current = false;
      }
    };

    recognition.onend = () => {
      // Only restart if we're still supposed to be listening AND not in the process of stopping
      if (isListening && !isStoppingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
          setIsListening(false);
          isStartingRef.current = false;
        }
      } else {
        // Clean stop
        setIsListening(false);
        isStoppingRef.current = false;
        isStartingRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, []); // Only initialize once

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Prevent starting if already starting or listening
    if (isStartingRef.current || isListening) {
      return;
    }

    if (recognitionRef.current) {
      setError(''); // Clear any previous errors
      finalTranscriptRef.current = ''; // Reset transcript buffer
      setTranscript('');
      isStartingRef.current = true;
      isStoppingRef.current = false;
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isStartingRef.current = false;
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setError('Failed to start recording. Please try again.');
        isStartingRef.current = false;
      }
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    // Prevent stopping if already stopping or not listening
    if (isStoppingRef.current || !isListening) {
      return;
    }

    if (recognitionRef.current) {
      isStoppingRef.current = true;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Failed to stop recognition:', e);
        setIsListening(false);
        isStoppingRef.current = false;
      }
    }
  }, [isListening]);

  // Return the final committed transcript for saving
  const getFinalTranscript = useCallback(() => {
    return finalTranscriptRef.current.trim();
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    getFinalTranscript
  };
}
