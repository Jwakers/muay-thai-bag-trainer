/**
 * Closed vocabulary for bundled callout clips.
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
  "teep",
  "rearKick",
  "leadBodyHook",
  "fakeTeep",
  "stepInLeadElbow",
  "rearHighKick",
  "rearUppercut",
  "switchKnee",
  "fakeCross",
  "stepOutRoundhouse",
  "leadUppercut",
  "rearElbow",
  "leadElbow",
  "clinchKnees",
  "landForward",
  "fakeSwitchKick",
  "stepInCross",
  "doubleSwitchKick",
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
  teep: "Teep",
  rearKick: "Rear kick",
  leadBodyHook: "Lead body hook",
  fakeTeep: "Fake teep",
  stepInLeadElbow: "Step-in lead elbow",
  rearHighKick: "Rear high kick",
  rearUppercut: "Rear uppercut",
  switchKnee: "Switch knee",
  fakeCross: "Fake cross",
  stepOutRoundhouse: "Step-out roundhouse",
  leadUppercut: "Lead uppercut",
  rearElbow: "Rear elbow",
  leadElbow: "Lead elbow",
  clinchKnees: "Clinch knees",
  landForward: "Land forward",
  fakeSwitchKick: "Fake switch kick",
  stepInCross: "Step-in cross",
  doubleSwitchKick: "Double switch kick",
};

export function isCalloutId(value: string): value is CalloutId {
  return (CALLOUT_IDS as readonly string[]).includes(value);
}
