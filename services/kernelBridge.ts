
import { AppState, ActionPacket, KernelState, VectorLayer, CognitiveMessage, Persona, PeerNode, TrainingConfig } from '../types';

const BASE_URL = '/api/v1';

/**
 * Core Dispatcher for Kernel Operations
 */
export const dispatchToKernel = async (action: ActionPacket): Promise<Partial<AppState> | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const endpoint = action.type.startsWith('STATE_') ? 'state/update' : 'kernel/execute';

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Bridge Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[BRIDGE] Dispatch Failed", error);
    return null;
  }
};

/**
 * AI Training Opt-in Management
 */
export const updateTrainingConfig = async (config: TrainingConfig) => {
  try {
    await fetch(`${BASE_URL}/ai/training-opt-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  } catch (e) {
    console.warn("[BRIDGE] Training config sync failed.");
  }
};

/**
 * Bitcoin Settlement Bridge
 */
export const requestBTCSettlement = async (address: string, amountCredits: number) => {
  try {
    const response = await fetch(`${BASE_URL}/blockchain/settle-btc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, amountCredits })
    });
    return await response.json();
  } catch (e) {
    return { status: 'ERROR', message: 'Bridge Offline' };
  }
};

/**
 * Distributed Compute: Peer Telemetry
 */
export const fetchPeers = async (): Promise<PeerNode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/compute/peers`);
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    return [];
  }
};

/**
 * Distributed Compute: Mining / Hash Report
 */
export const reportHashRate = async (rate: number): Promise<{ sessionYield: number } | null> => {
  try {
    const response = await fetch(`${BASE_URL}/blockchain/mine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hashrate: rate, timestamp: Date.now() })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
};

/**
 * Configuration & Persistence (Dotfile)
 */
export const syncDotfile = async (persona: Partial<Persona>, prefs: { verboseMode: boolean, style: string }) => {
  try {
    await fetch(`${BASE_URL}/config/dotfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...persona, ...prefs })
    });
  } catch (e) {
    console.warn("[BRIDGE] Dotfile sync failed.");
  }
};

/**
 * Vector Topology Hardening
 */
export const optimizePath = async (layerId: string): Promise<VectorLayer | null> => {
  try {
    const response = await fetch(`${BASE_URL}/vector/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layerId })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
};

/**
 * Telemetry Polling
 */
export const pollTelemetry = async (): Promise<Partial<KernelState> | null> => {
  try {
    const response = await fetch(`${BASE_URL}/telemetry/metrics`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return { status: 'OFFLINE' } as any;
  }
};

/**
 * Logs cognitive session events to the backend API.
 */
export const logCognitiveEvent = async (history: CognitiveMessage[]) => {
  try {
    await fetch(`${BASE_URL}/cognitive/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, timestamp: Date.now() })
    });
  } catch (e) {
    console.warn("[BRIDGE] Cognitive log failed.");
  }
};
