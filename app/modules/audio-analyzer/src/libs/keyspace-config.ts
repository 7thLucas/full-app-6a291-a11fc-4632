import { defaultAnalysisOptions } from "../constants/default-analysis-options";
import type { TranscriptionAnalysisOptions } from "./types";

const CONFIGS_BASE_URL =
  "https://micro-audio-analyzer.quantumbyte.ai/api/configs";

interface KeyspaceConfigResponse {
  configuration: TranscriptionAnalysisOptions;
}

/**
 * Fetches analysis options from the remote keyspace config API.
 * Falls back to {@link defaultAnalysisOptions} when the keyspace is not
 * configured, the record is not found (404), or the request fails.
 */
export async function fetchKeyspaceAnalysisOptions(): Promise<TranscriptionAnalysisOptions> {
  const keyspace = process.env._KEYSPACE;

  if (!keyspace) {
    return defaultAnalysisOptions;
  }

  try {
    const res = await fetch(`${CONFIGS_BASE_URL}/${encodeURIComponent(keyspace)}`);

    if (res.status === 404) {
      return defaultAnalysisOptions;
    }

    if (!res.ok) {
      console.warn(
        `[keyspace-config] Fetch failed (HTTP ${res.status}) — falling back to defaults`,
      );
      return defaultAnalysisOptions;
    }

    const data = (await res.json()) as KeyspaceConfigResponse;
    return data.configuration ?? defaultAnalysisOptions;
  } catch (err) {
    console.warn(
      "[keyspace-config] Request error — falling back to defaults:",
      err,
    );
    return defaultAnalysisOptions;
  }
}
