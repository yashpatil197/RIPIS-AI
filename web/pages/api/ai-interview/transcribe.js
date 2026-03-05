/**
 * API: POST /api/ai-interview/transcribe
 * Transcribes audio to text — uses Web Speech API on client, this is a fallback endpoint
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read the raw body as a buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return res.status(400).json({ error: "No audio data received" });
    }

    // If OpenAI Whisper API key is available, use it
    if (process.env.OPENAI_API_KEY) {
      try {
        const formData = new FormData();
        const blob = new Blob([buffer], { type: "audio/webm" });
        formData.append("file", blob, "audio.webm");
        formData.append("model", "whisper-1");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({ transcript: data.text });
        }
      } catch (e) {
        console.error("Whisper API error:", e);
      }
    }

    // Fallback: return a message asking user to use text input
    res.status(200).json({
      transcript: "",
      message: "Voice transcription requires an OpenAI API key. Please use the text input instead, or enable browser speech recognition.",
      useBrowserSpeech: true,
    });
  } catch (error) {
    console.error("Error in transcribe:", error);
    res.status(500).json({ error: "Failed to process audio" });
  }
}
