/**
 * Speech Processor - Consolidated voice handling module
 * Handles Whisper API transcription and speech config
 */

/**
 * Transcribe audio buffer using OpenAI Whisper API
 * @param {Buffer} audioBuffer - Raw audio data
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<{transcript: string, success: boolean}>}
 */
export async function transcribeAudio(audioBuffer, apiKey) {
    if (!apiKey) {
        return { transcript: "", success: false, message: "No API key configured" };
    }

    try {
        const formData = new FormData();
        const blob = new Blob([audioBuffer], { type: "audio/webm" });
        formData.append("file", blob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Whisper API returned ${response.status}`);
        }

        const data = await response.json();
        return { transcript: data.text || "", success: true };
    } catch (error) {
        console.error("Whisper transcription error:", error);
        return { transcript: "", success: false, message: error.message };
    }
}

/**
 * Get speech configuration for client-side settings
 */
export function getSpeechConfig() {
    return {
        language: "en-US",
        continuous: true,
        interimResults: false,
        maxDuration: 120, // 2 minutes max
        sampleRate: 16000,
    };
}
