import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SHIPSEAL_VERSION, appVersion } from '@/lib/version';

const root = resolve(__dirname, '..', '..');

describe('hosted deployment configuration', () => {
  it('has Vercel config for Vite output, API filesystem handling, and SPA fallback', () => {
    const vercelJsonPath = resolve(root, 'vercel.json');

    expect(existsSync(vercelJsonPath)).toBe(true);

    const config = JSON.parse(readFileSync(vercelJsonPath, 'utf8'));

    expect(config.framework).toBe('vite');
    expect(config.buildCommand).toBe('npm run build');
    expect(config.outputDirectory).toBe('dist');
    expect(config.routes).toEqual([
      { handle: 'filesystem' },
      { src: '/.*', dest: '/index.html' },
    ]);
  });

  it('uses the ShipSeal RC version constant consistently', () => {
    expect(SHIPSEAL_VERSION).toBe('0.1.0-rc1');
    expect(appVersion).toBe(SHIPSEAL_VERSION);
  });
});
