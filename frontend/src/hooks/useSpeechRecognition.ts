import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string;
  startListening: () => void;
  stopListening: () => void;
  getFinalTranscript: () => string;
  clearTranscript: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const isStoppingRef = useRef(false);
  const lastStartTimeRef = useRef(0);
  const sessionCountRef = useRef(0);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      
      interimTranscriptRef.current = interimTranscript;
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      if (isStoppingRef.current) {
        return;
      }

      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Ignore no-speech errors during active listening
        if (isListening) {
          return;
        }
      } else if (event.error === 'network') {
        setError('Network error. Please check your connection and try again.');
        setIsListening(false);
      } else if (event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (!isStoppingRef.current && isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          isStoppingRef.current = true;
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isSupported, isListening]);

  const startListening = useCallback(() => {
    const now = Date.now();
    if (now - lastStartTimeRef.current < 500) {
      return;
    }
    lastStartTimeRef.current = now;

    if (!recognitionRef.current) return;
    
    setError('');
    isStoppingRef.current = false;
    sessionCountRef.current += 1;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      if (e.message && e.message.includes('already started')) {
        setIsListening(true);
      } else {
        setError('Failed to start recording. Please try again.');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    isStoppingRef.current = true;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      setIsListening(false);
    }
  }, []);

  const getFinalTranscript = useCallback(() => {
    return finalTranscriptRef.current.trim();
  }, []);

  const clearTranscript = useCallback(() => {
    // Fully clear all transcript state to ensure clean slate for next recording
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    getFinalTranscript,
    clearTranscript
  };
}
