import { useGameStore } from "../store/useGameStore";
import BattleScreen from "./BattleScreen";
import TownHub from "./TownHub";
import Shop from "./Shop";
import ErrorBoundary from "./ErrorBoundary";

export default function GameManager() {
  const scene = useGameStore((s) => s.sceneStack.at(-1));

  const renderScreen = () => {
    if (!scene) return null;

    switch (scene.type) {
      case "battle":
        return <BattleScreen scene={scene} />;

      case "shop":
        return <Shop />;

      case "town":
        return <TownHub />;

      default:
        return (
          <div className="text-white p-4">
            Unknown scene: {scene.type}
          </div>
        );
    }
  };

  return (
    <ErrorBoundary
      onRecover={() => {
        useGameStore.getState().clearScenes();
      }}
    >
      {renderScreen()}
    </ErrorBoundary>
  );
}