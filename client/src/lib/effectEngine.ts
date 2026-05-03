import { Effect, EffectContext } from "./types";

/**
 * Runs all effects in order of priority
 */
export function runEffects(effects: Effect[], context: EffectContext) {
  let resultContext = { ...context };

  const sorted = [...effects].sort(
    (a, b) => (b.priority || 0) - (a.priority || 0)
  );

  for (const effect of sorted) {
    const result = effect.apply(resultContext);

    if (!result) continue;

    if (result.damageModifier) {
      resultContext.finalDamage *= result.damageModifier;
    }

    if (result.heal) {
      resultContext.player.hp = Math.min(
        resultContext.player.maxHp,
        resultContext.player.hp + result.heal
      );
    }

    if (result.log) {
      resultContext.logs.push(result.log);
    }

    if (result.skipTurn) {
      break;
    }
  }

  return resultContext;
}