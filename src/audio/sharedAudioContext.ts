let shared: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext {
  if (!shared) {
    shared = new AudioContext();
  }
  return shared;
}

/**
 * Call from a user gesture (e.g. difficulty select) so playback is not blocked on mobile.
 */
export async function resumeSharedAudioContext(): Promise<AudioContext> {
  const ctx = getSharedAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}
