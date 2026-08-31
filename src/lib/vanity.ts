// Grind de vanity mint no browser: todo token da plataforma nasce com o
// endereco terminando em MINT_SUFFIX. Paraleliza em Web Workers
// (~5k chaves/s por thread; sufixo de 3 chars ~ segundos na media).
import { Keypair } from '@solana/web3.js';

export const MINT_SUFFIX = 'PAD';

export function grindVanityMint(
  suffix: string,
  onProgress?: (tried: number) => void
): Promise<Keypair> {
  return new Promise((resolve, reject) => {
    const threads = Math.min(6, Math.max(2, (navigator.hardwareConcurrency || 4) - 1));
    const workers: Worker[] = [];
    let tried = 0;
    let done = false;

    const finish = (seed: Uint8Array | null, err?: Error) => {
      if (done) return;
      done = true;
      workers.forEach((w) => w.terminate());
      if (seed) resolve(Keypair.fromSeed(seed));
      else reject(err || new Error('vanity grind failed'));
    };

    for (let i = 0; i < threads; i++) {
      let w: Worker;
      try {
        w = new Worker(new URL('./vanity.worker.ts', import.meta.url));
      } catch (e: any) {
        finish(null, e);
        return;
      }
      workers.push(w);
      w.onmessage = (e: MessageEvent<{ found?: number[]; tried?: number }>) => {
        if (e.data.found) finish(new Uint8Array(e.data.found));
        else if (e.data.tried) {
          tried += e.data.tried;
          onProgress?.(tried);
        }
      };
      w.onerror = (e) => finish(null, new Error(e.message || 'worker error'));
      w.postMessage({ suffix, batch: 2000 });
    }
  });
}

// Com fallback: se workers nao rolarem (browser antigo), mint aleatorio.
export async function mintKeypair(
  onProgress?: (tried: number) => void
): Promise<Keypair> {
  try {
    return await grindVanityMint(MINT_SUFFIX, onProgress);
  } catch {
    return Keypair.generate();
  }
}
