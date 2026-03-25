export const WORKOUT_COMBOS = {
  beginner: [
    { title: "Jab, Cross, Lead Hook, Rear Low Kick", subtitle: "Basic continuous sequence", active: true },
    { title: "Double Jab, Cross, Switch Kick", subtitle: "Forward pressure sequence", active: true },
    { title: "Jab, Cross, Rear Roundhouse", subtitle: "Basic 1-2 finish with a hard kick", active: true },
    { title: "Jab, Cross, Lead Hook", subtitle: "Classic boxing combination", active: true },
    { title: "Lead Teep, Jab, Cross", subtitle: "Establish distance, then step in", active: true },
    { title: "Cross, Lead Hook, Cross", subtitle: "Simple power sequence", active: true },
    { title: "Jab, Rear Body Kick", subtitle: "Rapid high-low mix-up", active: true },
    { title: "Jab, Cross, Rear Knee", subtitle: "Basic straight clinch entry", active: true },
    { title: "Jab, Jab, Cross", subtitle: "Triple punch rhythm builder", active: true },
    { title: "Rear Teep, Switch Kick", subtitle: "Double kick rhythm sequence", active: true }
  ],
  intermediate: [
    { title: "Teep, Jab, Rear Kick", subtitle: "Maintain distance and punish", active: true },
    { title: "Lead Hook, Rear Low Kick", subtitle: "Classic Dutch-style continuous", active: true },
    { title: "Jab, Cross, Lead Body Hook, Rear Low Kick", subtitle: "Level-changing destruction", active: true },
    { title: "Fake Teep, Step-in Lead Elbow, Rear Knee", subtitle: "Closing the distance aggressively", active: true },
    { title: "Cross, Lead Hook, Rear Roundhouse, Switch Kick", subtitle: "Double kick chaining", active: true },
    { title: "Double Jab, Cross, Lead Hook, Rear High Kick", subtitle: "Building up to a head kick finish", active: true },
    { title: "Rear Body Kick, Cross, Lead Hook", subtitle: "Heavy kick-to-punch integration", active: true },
    { title: "Jab, Rear Uppercut, Lead Hook, Rear Low Kick", subtitle: "Inside boxing flowing to outside kick", active: true },
    { title: "Lead Hook, Cross, Switch Knee", subtitle: "Power rhythm combination", active: true },
    { title: "Jab, Cross, Rear Uppercut, Lead Hook", subtitle: "Inside pocket combination", active: true }
  ],
  advanced: [
    { title: "Cross, Lead Hook, Cross, Rear Knee", subtitle: "Heavy power and clinch entry", active: true },
    { title: "Fake Cross, Lead Hook, Rear Low Kick, Lead Teep", subtitle: "Feinting into kicks", active: true },
    { title: "Switch Kick, Cross, Lead Hook, Rear Knee, Step-out Roundhouse", subtitle: "Long flowing combination", active: true },
    { title: "Jab, Cross, Lead Uppercut, Rear Elbow, Clinch Knees", subtitle: "Heavy inside bag destruction", active: true },
    { title: "Rear Roundhouse, Land Forward, Lead Elbow, Rear Knee", subtitle: "Aggressive forward momentum", active: true },
    { title: "Jab, Fake Switch Kick, Lead Hook, Cross, Rear High Kick", subtitle: "Broken rhythm and feints", active: true },
    { title: "Lead Teep, Fake Teep, Step-in Cross, Lead Hook, Rear Low Kick", subtitle: "Distance manipulation", active: true },
    { title: "Double Switch Kick, Cross, Lead Hook, Rear Roundhouse", subtitle: "Heavy cardio kick chain", active: true }
  ]
};

export const getRandomCombos = (count = 1, difficulty = 'beginner') => {
  let pool = [];
  if (difficulty === 'mixed') {
    pool = [
      ...WORKOUT_COMBOS.beginner, 
      ...WORKOUT_COMBOS.intermediate, 
      ...WORKOUT_COMBOS.advanced
    ];
  } else if (difficulty && WORKOUT_COMBOS[difficulty]) {
    pool = WORKOUT_COMBOS[difficulty];
  } else {
    // Fallback to beginner
    pool = WORKOUT_COMBOS.beginner;
  }
  
  // Shuffle and pick requested amount
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
