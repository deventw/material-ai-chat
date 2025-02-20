export interface CompletionResult {
  content: string; // Full content (for non-streaming fallback)
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  model?: string;
}

export async function sendCompletion(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  onStream?: (chunk: string) => void // Callback to handle streaming chunks
): Promise<CompletionResult> {
  console.log('[API] Sending request, message count:', messages.length);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages,
        stream: true, // Enable streaming if the API supports it
      }),
    });

    console.log('[API] Received response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Error response content:', errorText);
      throw new Error(`API Error [${response.status}]: ${errorText.slice(0, 200)}`);
    }

    // If streaming is enabled, handle the response as a stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder('utf-8'); // Decode the streamed chunks
    let buffer = ''; // Holds incomplete lines
    let fullContent = ''; // Accumulates the entire response content

    try {
      while (true) {
        const { done, value } = await reader.read(); // Read the next chunk
        if (done) break; // Exit when the stream is complete

        // Decode the current chunk and add it to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from the buffer
        while (true) {
          const lineEnd = buffer.indexOf('\n'); // Find the next newline
          if (lineEnd === -1) break; // Exit if no complete line is found

          const line = buffer.slice(0, lineEnd).trim(); // Extract the line
          buffer = buffer.slice(lineEnd + 1); // Remove the processed line from the buffer

          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Extract the JSON data after `data: `

            if (data === '[DONE]') {
              console.log('[API] Streaming complete (received [DONE])');
              break;
            }

            try {
              const parsed = JSON.parse(data); // Parse the JSON data
              const content = parsed.choices[0]?.delta?.content; // Extract the content delta
              if (content) {
                fullContent += content; // Accumulate the full content
                if (onStream) {
                  onStream(content); // Pass the chunk to the callback for real-time updates
                }
              }
            } catch (e) {
              console.error('[API] Failed to parse JSON from line:', line, e);
              // Ignore invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.cancel(); // Ensure the reader is closed
    }

    console.log('[API] Full streaming content:', fullContent);
    return { content: fullContent }; // Return the full content once streaming is complete
  } catch (err) {
    console.error('[API] Request failed:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
    });
    throw err;
  }
}