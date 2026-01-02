// Streaming-capable MCP client for VectorForge
// - honors VITE_USE_MCP_PROXY and VITE_MCP_PROXY_URL
// - provides `sendChat` (non-stream) and `sendChatStream` (streaming)

type ChatPayload = Record<string, any>;

const USE_PROXY = (import.meta.env?.VITE_USE_MCP_PROXY ?? 'true') === 'true';
const PROXY_URL = import.meta.env?.VITE_MCP_PROXY_URL || 'http://localhost:3001/api/mcp/chat';
const PROXY_STREAM_URL = (import.meta.env?.VITE_MCP_PROXY_URL || 'http://localhost:3001/api/mcp/chat').replace(/\/chat$/, '/chat/stream');
const DEV_AUTH_HEADER = import.meta.env?.VITE_MCP_DEV_KEY || 'dev';

async function parseJsonSafe(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return {};
  }
}

function makeErrorFromResponse(resp: Response, data: any) {
  const errObj = data?.error || data || {};
  const message = errObj?.message || resp.statusText || 'Unknown error';
  const e: any = new Error(message);
  e.status = resp.status;
  e.code = errObj?.code;
  e.requestId = resp.headers?.get?.('X-Request-Id') || errObj?.requestId || null;
  e.raw = data;
  return e;
}

export async function sendChat(payload: ChatPayload) {
  const url = USE_PROXY ? PROXY_URL : (import.meta.env?.VITE_XIBALBA_ENDPOINT || '/api/v1/chat/completions');
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(USE_PROXY ? { 'X-MCP-DEV-KEY': DEV_AUTH_HEADER } : {})
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(resp);
  if (!resp.ok) {
    throw makeErrorFromResponse(resp, data);
  }
  return data;
}

type StreamHandlers = {
  onDelta?: (delta: string | null, meta?: any) => void;
  onError?: (err: Error) => void;
  onComplete?: (finalMessage?: any) => void;
};

export function sendChatStream(payload: ChatPayload, handlers: StreamHandlers = {}) {
  const controller = new AbortController();
  const signal = controller.signal;

  const url = USE_PROXY ? PROXY_STREAM_URL : (import.meta.env?.VITE_XIBALBA_ENDPOINT || '/api/v1/chat/completions').replace(/\/chat\/?$/, '/chat/stream');

  const promise = (async () => {
    let resp: Response | null = null;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(USE_PROXY ? { 'X-MCP-DEV-KEY': DEV_AUTH_HEADER } : {})
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!resp.ok) {
        const data = await parseJsonSafe(resp);
        throw makeErrorFromResponse(resp, data);
      }

      if (!resp.body) {
        const data = await parseJsonSafe(resp);
        handlers.onComplete?.(data);
        return data;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let done = false;

      const flushBufferAsLines = () => {
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? '';
        return lines.filter(Boolean);
      };

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) {
          done = true;
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        const lines = flushBufferAsLines();

        for (const rawLine of lines) {
          const line = rawLine.trim();

          if (line.startsWith('data:')) {
            const payloadStr = line.replace(/^data:\s*/, '');
            if (payloadStr === '[DONE]') {
              handlers.onComplete?.();
              return;
            }
            try {
              const json = JSON.parse(payloadStr);
              const delta =
                json?.choices?.[0]?.delta?.content ??
                json?.choices?.[0]?.delta ??
                json?.text ??
                json?.data ??
                null;
              handlers.onDelta?.(delta, json);
            } catch (e) {
              handlers.onDelta?.(payloadStr, { raw: payloadStr });
            }
            continue;
          }

          try {
            if (line === '[DONE]') {
              handlers.onComplete?.();
              return;
            }
            const json = JSON.parse(line);
            const delta =
              json?.choices?.[0]?.delta?.content ??
              json?.choices?.[0]?.delta ??
              json?.text ??
              json?.data ??
              null;
            handlers.onDelta?.(delta, json);
            continue;
          } catch {
            // not JSON
          }

          if (line) {
            handlers.onDelta?.(line, { raw: line });
          }
        }
      }

      if (buffer.trim()) {
        const leftover = buffer.trim();
        if (leftover === '[DONE]') {
          handlers.onComplete?.();
          return;
        }
        try {
          const json = JSON.parse(leftover);
          handlers.onDelta?.(
            json?.choices?.[0]?.delta?.content ?? json?.text ?? null,
            json
          );
        } catch {
          handlers.onDelta?.(leftover, { raw: leftover });
        }
      }

      handlers.onComplete?.();
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        handlers.onError?.(new Error('Stream aborted by caller'));
        return;
      }
      if (resp) {
        const parsed = await parseJsonSafe(resp);
        const e = makeErrorFromResponse(resp, parsed);
        handlers.onError?.(e);
        throw e;
      }
      handlers.onError?.(err);
      throw err;
    }
  })();

  return {
    cancel: (reason?: string) => controller.abort(reason ? new DOMException(reason) : undefined),
    promise,
  };
}
