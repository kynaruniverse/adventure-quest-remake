import { useState } from 'react';
import { Character, createDefaultPlayer } from '@/lib/gameEngine';
import { CharacterClass, CHARACTER_CLASSES } from '@/lib/characterClasses';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

  const classDefinition = CHARACTER_CLASSES[selectedClass];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-600 drop-shadow-lg mb-2">AdventureQuest</h1>
          <p className="text-amber-200 text-xl">Create Your Character</p>
        </div>

        {/* Character Name Input */}
        <Card className="bg-slate-700 border-amber-600 border-2 p-6 mb-8">
          <label className="block text-amber-400 font-bold mb-2">Character Name</label>
          <Input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter your character name"
            className="bg-slate-600 border-amber-600 text-white placeholder-slate-400"
          />
        </Card>

        {/* Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(Object.keys(CHARACTER_CLASSES) as CharacterClass[]).map((classType) => {
            const classDef = CHARACTER_CLASSES[classType];
            const isSelected = selectedClass === classType;

            return (
              <Card
                key={classType}
                onClick={() => setSelectedClass(classType)}
                className={`p-6 cursor-pointer transition border-2 ${
                  isSelected
                    ? 'bg-amber-600 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-slate-700 border-slate-600 hover:border-amber-600'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-amber-400'}`}>
                  {classDef.name}
                </h3>
                <p className={`text-sm mb-4 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {classDef.description}
                </p>

                {/* Stats Preview */}
                <div className={`text-xs space-y-1 mb-4 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                  <div>STR: {classDef.baseStats.str}</div>
                  <div>DEX: {classDef.baseStats.dex}</div>
                  <div>INT: {classDef.baseStats.int}</div>
                  <div>END: {classDef.baseStats.end}</div>
                </div>

                {/* Class Ability */}
                <div className={`border-t ${isSelected ? 'border-white' : 'border-slate-600'} pt-3`}>
                  <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-amber-300'}`}>
                    {classDef.classAbility.name}
                  </p>
                  <p className={`text-xs ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {classDef.classAbility.effect}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-4 text-center">
                    <p className="text-white font-bold text-lg">✓ Selected</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Class Details */}
        <Card className="bg-slate-700 border-amber-600 border-2 p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{classDefinition.name} Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-amber-300 font-bold mb-2">Base Stats</p>
              <div className="text-sm text-slate-300 space-y-1">
                <div>STR: {classDefinition.baseStats.str}</div>
                <div>DEX: {classDefinition.baseStats.dex}</div>
                <div>INT: {classDefinition.baseStats.int}</div>
                <div>END: {classDefinition.baseStats.end}</div>
                <div>CHA: {classDefinition.baseStats.cha}</div>
                <div>LUK: {classDefinition.baseStats.luk}</div>
              </div>
            </div>

            <div>
              <p className="text-amber-300 font-bold mb-2">Starting Spells</p>
              <div className="text-sm text-slate-300 space-y-1">
                {classDefinition.startingSpells.map((spell) => (
                  <div key={spell.id}>{spell.name} ({spell.cost} MP)</div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-amber-300 font-bold mb-2">Class Ability: {classDefinition.classAbility.name}</p>
            <p className="text-slate-300 text-sm mb-1">{classDefinition.classAbility.description}</p>
            <p className="text-amber-200 text-sm font-bold">{classDefinition.classAbility.effect}</p>
          </div>
        </Card>

        {/* Create Button */}
        <Button
          onClick={handleCreateCharacter}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 text-lg"
        >
          Create Character
        </Button>
      </div>
    </div>
  );
}
