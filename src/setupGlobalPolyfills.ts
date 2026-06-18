// setupGlobalPolyfills.ts

export {}; // <- Make this an external module

declare global {
  interface Window {
    global?: typeof globalThis;
  }
}

if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}
