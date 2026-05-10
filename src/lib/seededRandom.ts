export const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

export const randomInt = (rand: () => number, min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
