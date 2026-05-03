import { useState } from "react";
import { CharacterClass, CHARACTER_CLASSES } from "@/lib/characterClasses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { createPlayerFromClass } from "@/lib/characterFactory";
import { Character } from "@/lib/types"; // 👈 (recommended future move)

interface CharacterCreationProps {
  onCharacterCreated: (character: Character, selectedClass: CharacterClass) => void;
}

export default function CharacterCreation({
  onCharacterCreated,
}: CharacterCreationProps) {
  const [selectedClass, setSelectedClass] =
    useState<CharacterClass>("warrior");

  const [characterName, setCharacterName] =
    useState("Adventurer");

  const handleCreateCharacter = () => {
    const newCharacter = createPlayerFromClass(
      characterName.trim() || "Adventurer",
      selectedClass
    );

    onCharacterCreated(newCharacter, selectedClass);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 font-sans select-none overflow-hidden">
      
      {/* HEADER */}
      <header className="flex-none p-4 bg-slate-900 border-b-2 border-amber-600/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div>
            <h1 className="text-2xl font-black text-amber-500 uppercase">
              AdventureQuest
            </h1>
            <p className="text-[10px] text-amber-200/60 uppercase">
              Character Creation
            </p>
          </div>

          <div className="max-w-sm w-full">
            <Input
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter Name..."
              className="h-10 bg-slate-800 border-amber-600/50 text-white font-bold"
            />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-amber-400 text-xs font-black text-center mb-4 uppercase tracking-widest">
            Select Your Class
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {(Object.keys(CHARACTER_CLASSES) as CharacterClass[]).map(
              (classType) => {
                const classDef = CHARACTER_CLASSES[classType];
                const isSelected = selectedClass === classType;

                return (
                  <Card
                    key={classType}
                    onClick={() => setSelectedClass(classType)}
                    className={cn(
                      "cursor-pointer border-2 p-4 transition-all",
                      isSelected
                        ? "border-amber-400 bg-amber-600/20"
                        : "border-slate-800 bg-slate-900/50"
                    )}
                  >
                    <h3 className="text-lg font-black text-amber-500 uppercase">
                      {classDef.name}
                    </h3>

                    <p className="text-xs text-slate-400 mb-3">
                      {classDef.description}
                    </p>

                    <div className="text-xs text-slate-300">
                      STR {classDef.baseStats.str} | DEX{" "}
                      {classDef.baseStats.dex} | INT{" "}
                      {classDef.baseStats.int} | END{" "}
                      {classDef.baseStats.end}
                    </div>
                  </Card>
                );
              }
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800">
        <Button
          onClick={handleCreateCharacter}
          className="w-full bg-amber-600 text-white font-black uppercase"
        >
          Create {CHARACTER_CLASSES[selectedClass].name}
        </Button>
      </footer>

    </div>
  );
}