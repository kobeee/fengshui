import { afterEach, describe, expect, it, vi } from 'vitest';

let requestExpandedModeMock: ReturnType<typeof vi.fn>;

vi.mock('@devvit/web/client', () => {
  requestExpandedModeMock = vi.fn();

  return {
    // used by the "START GAME" button
    requestExpandedMode: requestExpandedModeMock,
  };
});

afterEach(() => {
  requestExpandedModeMock?.mockReset();
});

describe('Splash', () => {
  it('clicking the "START GAME" button calls requestExpandedMode(...)', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    // `src/splash.tsx` renders immediately on import (createRoot(...).render(...))
    await import('./splash');

    // Let React commit the initial render.
    await new Promise((r) => setTimeout(r, 0));

    const startButton = Array.from(document.querySelectorAll('button')).find(
      (b) => /start game/i.test(b.textContent ?? '')
    );
    expect(startButton).toBeTruthy();

    startButton!.click();

    expect(requestExpandedModeMock).toHaveBeenCalledTimes(1);
  });
});