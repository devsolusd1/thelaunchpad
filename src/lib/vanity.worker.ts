// Worker de grind de vanity mint: gera seeds ed25519 ate a pubkey (base58)
// terminar com o sufixo pedido. Reporta progresso a cada lote.
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';

self.onmessage = (e: MessageEvent<{ suffix: string; batch: number }>) => {
  const { suffix, batch } = e.data;
  const seed = new Uint8Array(32);
  for (;;) {
    for (let i = 0; i < batch; i++) {
      crypto.getRandomValues(seed);
      const pub = ed25519.getPublicKey(seed);
      if (bs58.encode(pub).endsWith(suffix)) {
        (self as unknown as Worker).postMessage({ found: Array.from(seed) });
        return;
      }
    }
    (self as unknown as Worker).postMessage({ tried: batch });
  }
};
