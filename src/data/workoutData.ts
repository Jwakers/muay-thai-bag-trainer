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
    {
      title: 'Teep, Jab, Rear Kick',
      subtitle: 'Maintain distance and punish',
      active: true,
      calloutIds: ['teep', 'jab', 'rearKick'],
    },
    {
      title: 'Lead Hook, Rear Low Kick',
      subtitle: 'Classic Dutch-style continuous',
      active: true,
      calloutIds: ['leadHook', 'rearLowKick'],
    },
    {
      title: 'Jab, Cross, Lead Body Hook, Rear Low Kick',
      subtitle: 'Level-changing destruction',
      active: true,
      calloutIds: ['jab', 'cross', 'leadBodyHook', 'rearLowKick'],
    },
    {
      title: 'Fake Teep, Step-in Lead Elbow, Rear Knee',
      subtitle: 'Closing the distance aggressively',
      active: true,
      calloutIds: ['fakeTeep', 'stepInLeadElbow', 'rearKnee'],
    },
    {
      title: 'Cross, Lead Hook, Rear Roundhouse, Switch Kick',
      subtitle: 'Double kick chaining',
      active: true,
      calloutIds: ['cross', 'leadHook', 'rearRoundhouse', 'switchKick'],
    },
    {
      title: 'Double Jab, Cross, Lead Hook, Rear High Kick',
      subtitle: 'Building up to a head kick finish',
      active: true,
      calloutIds: ['doubleJab', 'cross', 'leadHook', 'rearHighKick'],
    },
    {
      title: 'Rear Body Kick, Cross, Lead Hook',
      subtitle: 'Heavy kick-to-punch integration',
      active: true,
      calloutIds: ['rearBodyKick', 'cross', 'leadHook'],
    },
    {
      title: 'Jab, Rear Uppercut, Lead Hook, Rear Low Kick',
      subtitle: 'Inside boxing flowing to outside kick',
      active: true,
      calloutIds: ['jab', 'rearUppercut', 'leadHook', 'rearLowKick'],
    },
    {
      title: 'Lead Hook, Cross, Switch Knee',
      subtitle: 'Power rhythm combination',
      active: true,
      calloutIds: ['leadHook', 'cross', 'switchKnee'],
    },
    {
      title: 'Jab, Cross, Rear Uppercut, Lead Hook',
      subtitle: 'Inside pocket combination',
      active: true,
      calloutIds: ['jab', 'cross', 'rearUppercut', 'leadHook'],
    },
  ],
  advanced: [
    {
      title: 'Cross, Lead Hook, Cross, Rear Knee',
      subtitle: 'Heavy power and clinch entry',
      active: true,
      calloutIds: ['cross', 'leadHook', 'cross', 'rearKnee'],
    },
    {
      title: 'Fake Cross, Lead Hook, Rear Low Kick, Lead Teep',
      subtitle: 'Feinting into kicks',
      active: true,
      calloutIds: ['fakeCross', 'leadHook', 'rearLowKick', 'leadTeep'],
    },
    {
      title: 'Switch Kick, Cross, Lead Hook, Rear Knee, Step-out Roundhouse',
      subtitle: 'Long flowing combination',
      active: true,
      calloutIds: ['switchKick', 'cross', 'leadHook', 'rearKnee', 'stepOutRoundhouse'],
    },
    {
      title: 'Jab, Cross, Lead Uppercut, Rear Elbow, Clinch Knees',
      subtitle: 'Heavy inside bag destruction',
      active: true,
      calloutIds: ['jab', 'cross', 'leadUppercut', 'rearElbow', 'clinchKnees'],
    },
    {
      title: 'Rear Roundhouse, Land Forward, Lead Elbow, Rear Knee',
      subtitle: 'Aggressive forward momentum',
      active: true,
      calloutIds: ['rearRoundhouse', 'landForward', 'leadElbow', 'rearKnee'],
    },
    {
      title: 'Jab, Fake Switch Kick, Lead Hook, Cross, Rear High Kick',
      subtitle: 'Broken rhythm and feints',
      active: true,
      calloutIds: ['jab', 'fakeSwitchKick', 'leadHook', 'cross', 'rearHighKick'],
    },
    {
      title: 'Lead Teep, Fake Teep, Step-in Cross, Lead Hook, Rear Low Kick',
      subtitle: 'Distance manipulation',
      active: true,
      calloutIds: ['leadTeep', 'fakeTeep', 'stepInCross', 'leadHook', 'rearLowKick'],
    },
    {
      title: 'Double Switch Kick, Cross, Lead Hook, Rear Roundhouse',
      subtitle: 'Heavy cardio kick chain',
      active: true,
      calloutIds: ['doubleSwitchKick', 'cross', 'leadHook', 'rearRoundhouse'],
    },
  ],
};

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getComboPool(difficulty: Difficulty = 'beginner'): WorkoutCombo[] {
  if (difficulty === 'mixed') {
    return [
      ...WORKOUT_COMBOS.beginner,
      ...WORKOUT_COMBOS.intermediate,
      ...WORKOUT_COMBOS.advanced,
    ];
  } else if (difficulty in WORKOUT_COMBOS) {
    return WORKOUT_COMBOS[difficulty as ComboPoolKey];
  } else {
    return WORKOUT_COMBOS.beginner;
  }
}

export function getMaxRoundsForDifficulty(difficulty: Difficulty): number {
  return getComboPool(difficulty).length;
}

export function createWorkoutPlan(
  count: number,
  difficulty: Difficulty,
  exclude: readonly WorkoutCombo[] = [],
): WorkoutCombo[] {
  const excludedTitles = new Set(exclude.map((combo) => combo.title));
  const available = getComboPool(difficulty).filter(
    (combo) => !excludedTitles.has(combo.title),
  );
  const planLength = Math.max(0, Math.min(Math.floor(count), available.length));
  return shuffle(available).slice(0, planLength);
}
