/**
 * Sign and Append Helper
 * Wraps proof API calls for signing, appending to ledger, and creating bundles
 * #hashtag: proof signing verification helper
 */

export interface SignAndAppendOptions {
  /** Optional progress callback */
  onProgress?: (step: string) => void;
}

export interface SignAndAppendResult {
  success: boolean;
  eventId?: string;
  bundlePath?: string;
  error?: string;
}

/**
 * Canonicalize SVG by removing extra whitespace and normalizing
 */
function canonicalizeSvg(svg: string): string {
  return svg
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Sign and append SVG to ledger, then create proof bundle
 *
 * @param svgContent - The SVG content to sign
 * @param options - Optional progress callback
 * @returns Result with success status, eventId, bundlePath, or error
 */
export async function signAndAppend(
  svgContent: string,
  options?: SignAndAppendOptions
): Promise<SignAndAppendResult> {
  const { onProgress } = options || {};

  try {
    if (!svgContent || svgContent.trim().length === 0) {
      return {
        success: false,
        error: 'No drawing to sign. Please create a drawing first.',
      };
    }

    // Step 1: Canonicalize SVG
    onProgress?.('Canonicalizing SVG...');
    const canonicalSvg = canonicalizeSvg(svgContent);

    // Step 2: Sign (call backend API)
    onProgress?.('Signing...');
    const signResponse = await fetch('/api/proof/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        canonicalSvg,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!signResponse.ok) {
      const errorData = await signResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Signing failed: ${signResponse.statusText}`);
    }

    const signResult = await signResponse.json();
    const eventId = signResult.eventId;

    // Step 3: Append to ledger
    onProgress?.('Appending to ledger...');
    const appendResponse = await fetch('/api/proof/append', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        canonicalSvg,
        signature: signResult.signature,
        publicKey: signResult.publicKey,
      }),
    });

    if (!appendResponse.ok) {
      const errorData = await appendResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Append failed: ${appendResponse.statusText}`);
    }

    // Step 4: Create bundle
    onProgress?.('Creating proof bundle...');
    const bundleResponse = await fetch('/api/proof/bundle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
      }),
    });

    if (!bundleResponse.ok) {
      const errorData = await bundleResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Bundle creation failed: ${bundleResponse.statusText}`);
    }

    const bundleResult = await bundleResponse.json();
    const bundlePath = bundleResult.bundlePath || 'proof_bundle.zip';

    onProgress?.('Signed and appended');
    return {
      success: true,
      eventId,
      bundlePath,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
