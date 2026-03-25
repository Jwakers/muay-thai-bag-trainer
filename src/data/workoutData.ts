import type { Difficulty, WorkoutCombo } from '../types';

type ComboPoolKey = Exclude<Difficulty, 'mixed'>;

export const WORKOUT_COMBOS: Record<ComboPoolKey, WorkoutCombo[]> = {
  beginner: [
    {
      title: "Jab, Cross, Lead Hook, Rear Low Kick",
      subtitle: "Basic continuous sequence",
      active: true,
      calloutIds: ["jab", "cross", "leadHook", "rearLowKick"],
    },
    {
      title: "Double Jab, Cross, Switch Kick",
      subtitle: "Forward pressure sequence",
      active: true,
      calloutIds: ["doubleJab", "cross", "switchKick"],
    },
    {
      title: "Jab, Cross, Rear Roundhouse",
      subtitle: "Basic 1-2 finish with a hard kick",
      active: true,
      calloutIds: ["jab", "cross", "rearRoundhouse"],
    },
    {
      title: "Jab, Cross, Lead Hook",
      subtitle: "Classic boxing combination",
      active: true,
      calloutIds: ["jab", "cross", "leadHook"],
    },
    {
      title: "Lead Teep, Jab, Cross",
      subtitle: "Establish distance, then step in",
      active: true,
      calloutIds: ["leadTeep", "jab", "cross"],
    },
    {
      title: "Cross, Lead Hook, Cross",
      subtitle: "Simple power sequence",
      active: true,
      calloutIds: ["cross", "leadHook", "cross"],
    },
    {
      title: "Jab, Rear Body Kick",
      subtitle: "Rapid high-low mix-up",
      active: true,
      calloutIds: ["jab", "rearBodyKick"],
    },
    {
      title: "Jab, Cross, Rear Knee",
      subtitle: "Basic straight clinch entry",
      active: true,
      calloutIds: ["jab", "cross", "rearKnee"],
    },
    {
      title: "Jab, Jab, Cross",
      subtitle: "Triple punch rhythm builder",
      active: true,
      calloutIds: ["jab", "jab", "cross"],
    },
    {
      title: "Rear Teep, Switch Kick",
      subtitle: "Double kick rhythm sequence",
      active: true,
      calloutIds: ["rearTeep", "switchKick"],
    },
  ],
  intermediate: [
    { title: 'Teep, Jab, Rear Kick', subtitle: 'Maintain distance and punish', active: true },
    { title: 'Lead Hook, Rear Low Kick', subtitle: 'Classic Dutch-style continuous', active: true },
    { title: 'Jab, Cross, Lead Body Hook, Rear Low Kick', subtitle: 'Level-changing destruction', active: true },
    { title: 'Fake Teep, Step-in Lead Elbow, Rear Knee', subtitle: 'Closing the distance aggressively', active: true },
    { title: 'Cross, Lead Hook, Rear Roundhouse, Switch Kick', subtitle: 'Double kick chaining', active: true },
    { title: 'Double Jab, Cross, Lead Hook, Rear High Kick', subtitle: 'Building up to a head kick finish', active: true },
    { title: 'Rear Body Kick, Cross, Lead Hook', subtitle: 'Heavy kick-to-punch integration', active: true },
    { title: 'Jab, Rear Uppercut, Lead Hook, Rear Low Kick', subtitle: 'Inside boxing flowing to outside kick', active: true },
    { title: 'Lead Hook, Cross, Switch Knee', subtitle: 'Power rhythm combination', active: true },
    { title: 'Jab, Cross, Rear Uppercut, Lead Hook', subtitle: 'Inside pocket combination', active: true },
  ],
  advanced: [
    { title: 'Cross, Lead Hook, Cross, Rear Knee', subtitle: 'Heavy power and clinch entry', active: true },
    { title: 'Fake Cross, Lead Hook, Rear Low Kick, Lead Teep', subtitle: 'Feinting into kicks', active: true },
    { title: 'Switch Kick, Cross, Lead Hook, Rear Knee, Step-out Roundhouse', subtitle: 'Long flowing combination', active: true },
    { title: 'Jab, Cross, Lead Uppercut, Rear Elbow, Clinch Knees', subtitle: 'Heavy inside bag destruction', active: true },
    { title: 'Rear Roundhouse, Land Forward, Lead Elbow, Rear Knee', subtitle: 'Aggressive forward momentum', active: true },
    { title: 'Jab, Fake Switch Kick, Lead Hook, Cross, Rear High Kick', subtitle: 'Broken rhythm and feints', active: true },
    { title: 'Lead Teep, Fake Teep, Step-in Cross, Lead Hook, Rear Low Kick', subtitle: 'Distance manipulation', active: true },
    { title: 'Double Switch Kick, Cross, Lead Hook, Rear Roundhouse', subtitle: 'Heavy cardio kick chain', active: true },
  ],
};

export function getRandomCombos(count = 1, difficulty: Difficulty = 'beginner'): WorkoutCombo[] {
  let pool: WorkoutCombo[];
  if (difficulty === 'mixed') {
    pool = [...WORKOUT_COMBOS.beginner, ...WORKOUT_COMBOS.intermediate, ...WORKOUT_COMBOS.advanced];
  } else if (difficulty in WORKOUT_COMBOS) {
    pool = WORKOUT_COMBOS[difficulty as ComboPoolKey];
  } else {
    pool = WORKOUT_COMBOS.beginner;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
