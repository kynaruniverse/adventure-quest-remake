import { useGameStore } from "../store/useGameStore";
import CharacterCreation from "./CharacterCreation";
import BattleScreen from "./BattleScreen";
import TownHub from "./TownHub";
import Shop from "./Shop";
import CharacterSheet from "./CharacterSheet";
import WorldMapScreen from "./WorldMapScreen";
import { AnimatePresence, motion } from "framer-motion";

/**
 * =========================
 * GAME MANAGER
 * =========================
 *
 * Reads the top of sceneStack and renders the matching screen.
 * All navigation uses pushScene / popScene / replaceScene.
 * setScreen is gone — it never existed on the store.
 *
 * FIX BUG-01: sceneStack is now initialised in useGameStore.
 * FIX BUG-04 / BUG-05 / BUG-06: setScreen removed everywhere.
 * FIX BUG-10: CharacterCreation is now the initial scene.
 * ADDED: "map" and "character-sheet" scene routing.
 */

const PAGE_VARIANTS = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.22, ease: "easeOut" } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function GameManager() {
  const sceneStack = useGameStore((s) => s.sceneStack);

  // sceneStack is always initialised — no undefined risk
  const current = sceneStack[sceneStack.length - 1] ?? { type: "character-creation" };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.type}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full w-full"
      >
        {renderScene(current.type)}
      </motion.div>
    </AnimatePresence>
  );
}

function renderScene(scene: string) {
  switch (scene) {
    case "character-creation":
      return <CharacterCreation />;

    case "town":
      return <TownHub />;

    case "battle":
      return <BattleScreen />;

    case "shop":
      return <Shop />;

    case "map":
      return <WorldMapScreen />;

    case "character-sheet":
      return <CharacterSheet />;

    default:
      return <TownHub />;
  }
}
