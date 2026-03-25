/**
 * Closed vocabulary for bundled callout clips (beginner MVP).
 * Filenames: `/audio/{id}.wav`
 */
export const CALLOUT_IDS = [
  "jab",
  "cross",
  "leadHook",
  "rearLowKick",
  "doubleJab",
  "switchKick",
  "rearRoundhouse",
  "leadTeep",
  "rearBodyKick",
  "rearKnee",
  "rearTeep",
] as const;

export type CalloutId = (typeof CALLOUT_IDS)[number];

export const CALLOUT_LABELS: Record<CalloutId, string> = {
  jab: "Jab",
  cross: "Cross",
  leadHook: "Lead hook",
  rearLowKick: "Rear low kick",
  doubleJab: "Double jab",
  switchKick: "Switch kick",
  rearRoundhouse: "Rear roundhouse",
  leadTeep: "Lead teep",
  rearBodyKick: "Rear body kick",
  rearKnee: "Rear knee",
  rearTeep: "Rear teep",
};

export function isCalloutId(value: string): value is CalloutId {
  return (CALLOUT_IDS as readonly string[]).includes(value);
}
