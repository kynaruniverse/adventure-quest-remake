import { useGameStore } from "../store/useGameStore";
import BattleScreen from "./BattleScreen";
import TownHub from "./TownHub";
import Shop from "./Shop";
// import MapScreen from "./MapScreen"; // future-ready

export default function GameManager() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case "battle":
      return <BattleScreen />;

    case "shop":
      return <Shop />;

    case "town":
    default:
      return <TownHub />;
  }
}