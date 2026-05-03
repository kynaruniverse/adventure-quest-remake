import { useState } from 'react';
import { Character, createDefaultPlayer } from '@/lib/gameEngine';
import { CharacterClass, CHARACTER_CLASSES } from '@/lib/characterClasses';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CharacterCreationProps {
  onCharacterCreated: (character: Character, selectedClass: CharacterClass) => void;
}

export default function CharacterCreation({ onCharacterCreated }: CharacterCreationProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');
  const [characterName, setCharacterName] = useState('Adventurer');

  const handleCreateCharacter = () => {
    const baseCharacter = createDefaultPlayer();
    const classDefinition = CHARACTER_CLASSES[selectedClass];

    const newCharacter: Character = {
      ...baseCharacter,
      name: characterName || 'Adventurer',
      stats: classDefinition.baseStats,
      spells: classDefinition.startingSpells,
      maxHp: 50 + classDefinition.baseStats.end * 2,
      hp: 50 + classDefinition.baseStats.end * 2,
      maxMp: 30 + classDefinition.baseStats.int * 2,
      mp: 30 + classDefinition.baseStats.int * 2,
    };

    onCharacterCreated(newCharacter, selectedClass);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 font-sans select-none overflow-hidden">
      {/* 1. STICKY HEADER (Always visible) */}
      <header className="flex-none p-4 bg-slate-900 border-b-2 border-amber-600/50 z-30 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-amber-500 uppercase tracking-tighter leading-none">AdventureQuest</h1>
            <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-widest">Character Creation</p>
          </div>
          
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter Name..."
              className="h-10 bg-slate-800 border-amber-600/50 text-white font-bold"
            />
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          
          <h2 className="text-amber-400 font-black uppercase text-xs mb-4 tracking-widest text-center">Select Your Class</h2>
          
          {/* Class Selection Grid - Landscape optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
            {(Object.keys(CHARACTER_CLASSES) as CharacterClass[]).map((classType) => {
              const classDef = CHARACTER_CLASSES[classType];
              const isSelected = selectedClass === classType;

              return (
                <Card
                  key={classType}
                  onClick={() => setSelectedClass(classType)}
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all duration-200 border-2",
                    isSelected
                      ? 'bg-amber-600/20 border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                      : 'bg-slate-900/50 border-slate-800 hover:border-amber-600/50'
                  )}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={cn("text-xl font-black uppercase", isSelected ? 'text-white' : 'text-amber-500')}>
                        {classDef.name}
                      </h3>
                      {isSelected && <span className="text-white text-xs font-black bg-amber-600 px-2 py-0.5 rounded">SELECTED</span>}
                    </div>

                    <p className={cn("text-xs leading-relaxed mb-4 h-12 overflow-hidden", isSelected ? 'text-amber-100' : 'text-slate-400')}>
                      {classDef.description}
                    </p>

                    {/* Compact Stats Row */}
                    <div className="flex flex-row justify-between gap-1 mb-4">
                      {['str', 'dex', 'int', 'end'].map((stat) => (
                        <div key={stat} className="flex-1 bg-slate-950/50 p-1 rounded border border-slate-800 text-center">
                          <p className="text-[8px] text-slate-500 uppercase font-bold">{stat}</p>
                          <p className="text-xs text-white font-black">{classDef.baseStats[stat as keyof typeof classDef.baseStats]}</p>
                        </div>
                      ))}
                    </div>

                    {/* Class Ability Box */}
                    <div className={cn("p-2 rounded border", isSelected ? 'bg-amber-500/20 border-amber-400/50' : 'bg-slate-950 border-slate-800')}>
                      <p className="text-[10px] font-black text-amber-400 uppercase leading-none mb-1">{classDef.classAbility.name}</p>
                      <p className="text-[9px] text-slate-300 leading-tight">{classDef.classAbility.effect}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. STICKY FOOTER (The "Select" Button) */}
      <footer className="flex-none p-4 bg-slate-900 border-t-2 border-slate-800 z-30">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handleCreateCharacter}
            variant="retro"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-xl py-8 shadow-[0_6px_0_0_#92400e] active:shadow-none active:translate-y-1 transition-all"
          >
            Confirm {CHARACTER_CLASSES[selectedClass].name}
          </Button>
        </div>
      </footer>
    </div>
  );
}
