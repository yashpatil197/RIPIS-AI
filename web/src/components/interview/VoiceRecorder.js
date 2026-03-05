/**
 * VoiceRecorder - Voice input with waveform visualizer and dark theme
 */

import { useState, useRef, useEffect, useCallback } from "react";

export default function VoiceRecorder({ onTranscript, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [useBrowserSpeech, setUseBrowserSpeech] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Audio level analyzer for waveform
  const startAudioAnalysis = useCallback((stream) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      // Audio analysis not available, non-critical
    }
  }, []);

  const startRecording = async () => {
    // Try browser SpeechRecognition first
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setUseBrowserSpeech(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      let transcript = "";
      recognition.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            transcript += e.results[i][0].transcript + " ";
          }
        }
      };
      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      recognition.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (transcript.trim()) {
          onTranscript(transcript.trim());
        }
      };

      // Also try to get audio stream for visualization
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        startAudioAnalysis(stream);
      } catch (e) {
        // Visualization won't work but recording still will
      }

      recognition.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      return;
    }

    // Fallback to MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startAudioAnalysis(stream);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        if (timerRef.current) clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        setIsProcessing(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions or use text input.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && useBrowserSpeech) {
      setIsProcessing(true);
      recognitionRef.current.stop();
    } else if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const processAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      const res = await fetch("/api/ai-interview/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.transcript) {
        onTranscript(data.transcript);
      } else if (data.useBrowserSpeech) {
        alert("Server transcription unavailable. Please use the text input.");
      } else {
        alert("Could not transcribe audio. Please try again or use text input.");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing audio. Please use text input.");
    }
  };

  const formatDuration = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Waveform bars component
  const WaveformBars = () => (
    <div className="flex items-center gap-[2px] h-5">
      {Array.from({ length: 12 }, (_, i) => {
        const baseHeight = 4;
        const extraHeight = audioLevel * 16 * (1 + Math.sin(Date.now() / 200 + i * 0.5) * 0.5);
        return (
          <div key={i}
            className="waveform-bar rounded-full"
            style={{
              height: `${baseHeight + extraHeight}px`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0.5 + audioLevel * 0.5,
              background: `linear-gradient(180deg, #3b82f6, #8b5cf6)`,
            }}
          />
        );
      })}
    </div>
  );

  if (isRecording) {
    return (
      <div className="rounded-xl p-4 flex items-center justify-between animate-fade-in-up"
        style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-40" />
          </div>
          <span className="text-red-400 font-medium text-sm">Recording...</span>
          <span className="text-red-300 text-sm font-mono">{formatDuration(duration)}</span>
          <WaveformBars />
        </div>
        {/* Volume level bar */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(239,68,68,0.2)" }}>
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${audioLevel * 100}%`, background: "linear-gradient(90deg, #f87171, #ef4444)" }} />
          </div>
          <button onClick={stopRecording}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium text-sm hover:scale-105 active:scale-95">
            ⏹ Stop
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="rounded-xl p-4 flex items-center gap-3 animate-fade-in-up"
        style={{ background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)" }}>
        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-yellow-400 font-medium">Processing speech...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 flex items-center justify-between animate-fade-in-up"
      style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
      <span className="text-blue-300 text-sm">🎤 Voice recording ready</span>
      <div className="flex gap-2">
        <button onClick={startRecording}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium hover:scale-105 active:scale-95">
          🎤 Start Recording
        </button>
        <button onClick={onCancel}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
