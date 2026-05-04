export function createMonster(level: number) {
  const templates = [
    { name: "Goblin", baseHp: 20, baseDamage: 5, element: "earth" },
    { name: "Skeleton", baseHp: 25, baseDamage: 7, element: "darkness" },
    { name: "Fire Elemental", baseHp: 30, baseDamage: 10, element: "fire" },
    { name: "Slime", baseHp: 15, baseDamage: 4, element: "water" },
    { name: "Orc", baseHp: 28, baseDamage: 8, element: "earth" },
  ];

  const template =
    templates[Math.floor(Math.random() * templates.length)];

  const hp = template.baseHp + level * 3;

  return {
    id: `monster-${Date.now()}`,
    name: template.name,
    level,

    // 🧠 CORE COMBAT STATS (future effect system compatible)
    stats: {
      str: 8 + level,
      dex: 8 + level,
      int: 6 + level,
      end: 8 + level,
      cha: 5,
      luk: 5,
    },

    hp,
    maxHp: hp,

    // ⚠️ kept for now but will be phased into stats-based scaling later
    baseDamage: template.baseDamage + level * 0.5,

    element: template.element,

    // 🧠 future-proof hooks (for status effects / pets / gear systems)
    effects: [],
  };
}