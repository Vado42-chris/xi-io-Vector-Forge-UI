/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_XIBALBA_MCP_URL?: string;
  readonly VITE_XIBALBA_API_KEY?: string;
  readonly VITE_XIBALBA_MODEL?: string;
  readonly VITE_XIBALBA_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

