import React, { useState, useRef, useEffect } from 'react';
import { Play, Video, Settings, ChevronRight, ChevronLeft, Plus, Copy, Edit3, Check, Trash2, ArrowRight, ArrowLeft, Pause } from 'lucide-react';
import Court from './Court';

const SET_TEMPLATES = {
  5: [
    { id: 'horns', name: 'Horns Set', positions: { offense: [{x: 50, y: 85}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 35, y: 40}, {x: 65, y: 40}], defense: [{x: 50, y: 70}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 40, y: 48}, {x: 60, y: 48}], ball: {x: 50, y: 85}, lines: [] } },
    { id: '5-out', name: '5-Out Motion', positions: { offense: [{x: 50, y: 85}, {x: 15, y: 45}, {x: 85, y: 45}, {x: 8, y: 10}, {x: 92, y: 10}], defense: [{x: 50, y: 70}, {x: 28, y: 45}, {x: 72, y: 45}, {x: 15, y: 25}, {x: 85, y: 25}], ball: {x: 50, y: 85}, lines: [] } },
    { id: 'floppy', name: 'Floppy Action', positions: { offense: [{x: 50, y: 85}, {x: 35, y: 20}, {x: 65, y: 20}, {x: 25, y: 35}, {x: 75, y: 35}], defense: [{x: 50, y: 70}, {x: 35, y: 28}, {x: 65, y: 28}, {x: 30, y: 45}, {x: 70, y: 45}], ball: {x: 50, y: 85}, lines: [] } }
  ],
  4: [
    { id: '4-out', name: '4-Out Set', positions: { offense: [{x: 50, y: 85}, {x: 15, y: 45}, {x: 85, y: 45}, {x: 15, y: 15}], defense: [{x: 50, y: 70}, {x: 28, y: 45}, {x: 72, y: 45}, {x: 25, y: 25}], ball: {x: 50, y: 85}, lines: [] } },
    { id: 'box', name: 'Box Set', positions: { offense: [{x: 50, y: 85}, {x: 35, y: 40}, {x: 65, y: 40}, {x: 35, y: 25}], defense: [{x: 50, y: 70}, {x: 35, y: 50}, {x: 65, y: 50}, {x: 35, y: 35}], ball: {x: 50, y: 85}, lines: [] } },
    { id: 'diamond', name: 'Diamond Set', positions: { offense: [{x: 50, y: 85}, {x: 25, y: 45}, {x: 75, y: 45}, {x: 50, y: 30}], defense: [{x: 50, y: 70}, {x: 30, y: 55}, {x: 70, y: 55}, {x: 50, y: 40}], ball: {x: 50, y: 85}, lines: [] } }
  ],
  3: [
    { id: 'split', name: 'Post Split', positions: { offense: [{x: 35, y: 80}, {x: 15, y: 45}, {x: 25, y: 25}], defense: [{x: 35, y: 70}, {x: 25, y: 45}, {x: 30, y: 35}], ball: {x: 35, y: 80}, lines: [] } },
    { id: 'weave', name: '3-Man Weave', positions: { offense: [{x: 50, y: 85}, {x: 15, y: 70}, {x: 85, y: 70}], defense: [{x: 50, y: 70}, {x: 25, y: 60}, {x: 75, y: 60}], ball: {x: 50, y: 85}, lines: [] } },
    { id: 'triangle', name: 'Triangle Set', positions: { offense: [{x: 15, y: 45}, {x: 8, y: 10}, {x: 25, y: 25}], defense: [{x: 25, y: 45}, {x: 15, y: 20}, {x: 35, y: 35}], ball: {x: 15, y: 45}, lines: [] } }
  ],
  2: [
    { id: 'pnr', name: 'High P&R', positions: { offense: [{x: 65, y: 85}, {x: 50, y: 75}], defense: [{x: 60, y: 75}, {x: 50, y: 65}], ball: {x: 65, y: 85}, lines: [] } },
    { id: 'dho', name: 'Dribble Hand-Off', positions: { offense: [{x: 50, y: 85}, {x: 15, y: 45}], defense: [{x: 50, y: 70}, {x: 25, y: 50}], ball: {x: 50, y: 85}, lines: [] } },
    { id: 'pnp', name: 'Pick & Pop', positions: { offense: [{x: 35, y: 85}, {x: 50, y: 75}], defense: [{x: 40, y: 75}, {x: 50, y: 65}], ball: {x: 35, y: 85}, lines: [] } }
  ],
  1: [
    { id: 'iso-top', name: 'Top Isolation', positions: { offense: [{x: 50, y: 80}], defense: [{x: 50, y: 65}], ball: {x: 50, y: 80}, lines: [] } },
    { id: 'iso-wing', name: 'Wing Iso', positions: { offense: [{x: 15, y: 45}], defense: [{x: 25, y: 45}], ball: {x: 15, y: 45}, lines: [] } },
    { id: 'post-up', name: 'Low Post', positions: { offense: [{x: 35, y: 25}], defense: [{x: 45, y: 30}], ball: {x: 35, y: 25}, lines: [] } }
  ]
};

const PLAY_NAMES = {
  'horns': ['Horns Flare', 'Horns Dive', 'Horns P&R', 'Horns Elbow', 'Horns Iso', 'Horns Reverse'],
  '5-out': ['Pass & Cut', 'Away Screen', 'Dribble At', 'Backdoor Cut', 'Top P&R', 'Drive & Kick'],
  'floppy': ['Floppy Main', 'Floppy Baseline', 'Floppy Quick', 'Floppy Post', 'Elevator Doors', 'Floppy Slip'],
  '4-out': ['Slot Drive', 'Wing P&R', 'Corner Pin', 'Flash Post', 'Skip Pass', 'DHO'],
  'box': ['Cross Screen', 'UCLA Cut', 'Post Entry', 'Flare Action', 'Iverson Cut', 'Box Pop'],
  'diamond': ['Point Guard Post', 'Wing Iso', 'High Post Split', 'Baseline Drive', 'Backdoor', 'Elbow Action'],
  'split': ['Post Split', 'Face Up', 'Backdoor Cut', 'Rescreen', 'Kickout', 'Drop Step'],
  'weave': ['3-Man Weave', 'Fake Hand-Off', 'Backdoor', 'Pitch & Screen', 'Double Screen', 'Flare'],
  'triangle': ['Pinch Post', 'Corner Entry', 'Blind Pig', 'UCLA', 'Solo Cut', 'Baseline Screen'],
  'pnr': ['Spread P&R', 'Reject Screen', 'Snake Dribble', 'Short Roll', 'Slip Screen', 'Hostage Dribble'],
  'dho': ['Standard DHO', 'Fake DHO', 'Pitch & Go', 'Keep & Drive', 'Hand-Off P&R', 'Backdoor'],
  'pnp': ['Pick & Pop', 'Ghost Screen', 'Pop & Drive', 'Pop & Pass', 'Rescreen', 'Slip & Pop'],
  'iso-top': ['Top Blowby', 'Stepback 3', 'Cross & Drive', 'Hesitation', 'Post Up Top', 'Floater'],
  'iso-wing': ['Baseline Drive', 'Middle Drive', 'Spin Move', 'Pull-up', 'Jab & Go', 'Step Through'],
  'post-up': ['Drop Step', 'Hook Shot', 'Fadeaway', 'Up & Under', 'Face Up Drive', 'Spin to Middle']
};

// Mapped out Horns play with multiple reads
const PRIMARY_OPTIONS = {
  'horns': [
    {
      id: 'opt1',
      name: 'Primary: Flare',
      steps: [
        { id: 's1', instruction: 'PG (1) initiates at the top. Bigs at the elbows, shooters in the corners.', positions: { offense: [ {x: 50, y: 85}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 35, y: 40}, {x: 65, y: 40} ], defense: [ {x: 50, y: 70}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 40, y: 48}, {x: 60, y: 48} ], ball: {x: 50, y: 85}, lines: [] } },
        { id: 's2', instruction: '1 passes to 5. 4 immediately sets a flare screen for 1.', positions: { offense: [ {x: 25, y: 65}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 45, y: 65}, {x: 65, y: 40} ], defense: [ {x: 35, y: 60}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 45, y: 50}, {x: 55, y: 45} ], ball: {x: 65, y: 40}, lines: [ { type: 'pass', start: {x: 50, y: 85}, end: {x: 65, y: 40} }, { type: 'cut', start: {x: 50, y: 85}, end: {x: 25, y: 65} }, { type: 'screen', start: {x: 35, y: 40}, end: {x: 45, y: 65} } ] } },
        { id: 's3', instruction: '1 is open. 5 passes to 1. 4 rolls to the basket.', positions: { offense: [ {x: 15, y: 50}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 45, y: 25}, {x: 65, y: 40} ], defense: [ {x: 22, y: 45}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 45, y: 35}, {x: 55, y: 45} ], ball: {x: 15, y: 50}, lines: [ { type: 'pass', start: {x: 65, y: 40}, end: {x: 15, y: 50} }, { type: 'cut', start: {x: 45, y: 65}, end: {x: 45, y: 25} } ] } }
      ]
    },
    {
      id: 'opt2',
      name: 'Counter: Slip',
      steps: [
        { id: 's1', instruction: 'PG (1) initiates at the top. 5 receives the pass.', positions: { offense: [ {x: 50, y: 85}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 35, y: 40}, {x: 65, y: 40} ], defense: [ {x: 50, y: 70}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 40, y: 48}, {x: 60, y: 48} ], ball: {x: 50, y: 85}, lines: [] } },
        { id: 's2', instruction: 'Defense anticipates the flare. 4 rejects the screen and slips hard to the rim.', positions: { offense: [ {x: 45, y: 80}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 35, y: 15}, {x: 65, y: 40} ], defense: [ {x: 35, y: 70}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 35, y: 35}, {x: 55, y: 45} ], ball: {x: 65, y: 40}, lines: [ { type: 'pass', start: {x: 50, y: 85}, end: {x: 65, y: 40} }, { type: 'cut', start: {x: 35, y: 40}, end: {x: 35, y: 15} } ] } },
        { id: 's3', instruction: '5 hits 4 with the quick pocket pass for the uncontested layup.', positions: { offense: [ {x: 35, y: 75}, {x: 8, y: 10}, {x: 92, y: 10}, {x: 45, y: 8}, {x: 65, y: 40} ], defense: [ {x: 30, y: 65}, {x: 15, y: 25}, {x: 85, y: 25}, {x: 40, y: 25}, {x: 55, y: 45} ], ball: {x: 45, y: 8}, lines: [ { type: 'pass', start: {x: 65, y: 40}, end: {x: 45, y: 8} } ] } }
      ]
    }
  ]
};

// Generates 90 plays, all with multiple options and multiple steps
const generateLibrary = () => {
  const library = [];
  let playIdCounter = 1;

  Object.keys(SET_TEMPLATES).forEach(size => {
    SET_TEMPLATES[size].forEach(set => {
      const names = PLAY_NAMES[set.id];
      names.forEach((playName, index) => {
        
        let options;
        if (index === 0 && PRIMARY_OPTIONS[set.id]) {
          options = PRIMARY_OPTIONS[set.id];
        } else {
          // Auto-generate generic multi-step reads for the rest of the library
          options = [
            {
              id: 'opt1', name: 'Primary Read',
              steps: [
                { id: 's1', instruction: `Setup for ${playName}.`, positions: JSON.parse(JSON.stringify(set.positions)) },
                { id: 's2', instruction: `Initiate primary action.`, positions: JSON.parse(JSON.stringify(set.positions)) },
                { id: 's3', instruction: `Execute the finish.`, positions: JSON.parse(JSON.stringify(set.positions)) }
              ]
            },
            {
              id: 'opt2', name: 'Counter Option',
              steps: [
                { id: 's1', instruction: `Setup for ${playName}.`, positions: JSON.parse(JSON.stringify(set.positions)) },
                { id: 's2', instruction: `Defense overplays. Initiate counter.`, positions: JSON.parse(JSON.stringify(set.positions)) },
                { id: 's3', instruction: `Execute the counter finish.`, positions: JSON.parse(JSON.stringify(set.positions)) }
              ]
            }
          ];
        }
        
        library.push({
          id: (playIdCounter++).toString(),
          setId: set.id,
          rosterSize: parseInt(size),
          name: playName,
          desc: index === 0 ? 'Fully mapped play with reads.' : 'Pre-built multi-step template.',
          options: JSON.parse(JSON.stringify(options))
        });
      });
    });
  });
  return library;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('plays');
  const [plays, setPlays] = useState(generateLibrary());
  const [playsScreen, setPlaysScreen] = useState('library'); 
  const [rosterSizeFilter, setRosterSizeFilter] = useState(5);
  
  const [activePlay, setActivePlay] = useState(null);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);
  
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    return () => clearTimeout(playTimerRef.current);
  }, []);

  const togglePlay = () => {
    const activeSteps = activePlay.options[activeOptionIndex].steps;
    if (!activePlay || activeSteps.length <= 1) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      clearTimeout(playTimerRef.current);
    } else {
      setCurrentStepIndex(0); 
      setIsPlaying(true);
      const totalDuration = (activeSteps.length - 1) * 1500;
      playTimerRef.current = setTimeout(() => {
        setIsPlaying(false);
        setCurrentStepIndex(activeSteps.length - 1); 
      }, totalDuration);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
  };

  const handleOpenPlay = (play) => {
    stopPlayback();
    setActivePlay(play);
    setActiveOptionIndex(0);
    setCurrentStepIndex(0);
    setPlaysScreen('view');
  };

  const handleCreateBlank = () => {
    stopPlayback();
    const defaultSet = SET_TEMPLATES[rosterSizeFilter][0];
    const newOptions = [
      {
        id: 'opt1', name: 'Primary Read',
        steps: [
          { id: 's1', instruction: 'Start', positions: JSON.parse(JSON.stringify(defaultSet.positions)) },
          { id: 's2', instruction: 'Action', positions: JSON.parse(JSON.stringify(defaultSet.positions)) }
        ]
      }
    ];
    setActivePlay({ 
      id: Date.now().toString(), setId: defaultSet.id, name: 'New Play', desc: 'Custom play description', 
      rosterSize: rosterSizeFilter, options: newOptions
    });
    setActiveOptionIndex(0);
    setCurrentStepIndex(0);
    setEditName('New Play');
    setEditDesc('Custom play description');
    setPlaysScreen('edit');
  };

  const handleEditPlay = () => {
    stopPlayback();
    setEditName(activePlay.name);
    setEditDesc(activePlay.desc);
    setPlaysScreen('edit');
  };

  const handleUseTemplate = () => {
    stopPlayback();
    setActivePlay({ ...activePlay, id: Date.now().toString() });
    setEditName(`${activePlay.name} (Copy)`);
    setEditDesc(activePlay.desc);
    setPlaysScreen('edit');
  };

  const handleSavePlay = () => {
    const updatedPlay = { ...activePlay, name: editName, desc: editDesc };
    const exists = plays.find(p => p.id === updatedPlay.id);
    if (exists) setPlays(plays.map(p => p.id === updatedPlay.id ? updatedPlay : p));
    else setPlays([...plays, updatedPlay]);
    
    setActivePlay(updatedPlay);
    setPlaysScreen('view');
  };

  // --- Deep State Mutators for the active Option's steps ---
  const handleAddStep = () => {
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    const currentStep = newPlay.options[activeOptionIndex].steps[currentStepIndex];
    const newStep = { id: Date.now().toString(), instruction: 'New step...', positions: JSON.parse(JSON.stringify(currentStep.positions)) };
    newPlay.options[activeOptionIndex].steps.splice(currentStepIndex + 1, 0, newStep);
    setActivePlay(newPlay);
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handleDeleteStep = () => {
    if (activePlay.options[activeOptionIndex].steps.length <= 1) return;
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    newPlay.options[activeOptionIndex].steps.splice(currentStepIndex, 1);
    setActivePlay(newPlay);
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
  };

  const handleInstructionChange = (text) => {
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    newPlay.options[activeOptionIndex].steps[currentStepIndex].instruction = text;
    setActivePlay(newPlay);
  };

  const handleUpdatePosition = (type, index, newPos) => {
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    const positions = newPlay.options[activeOptionIndex].steps[currentStepIndex].positions;
    if (type === 'ball') positions.ball = newPos;
    else positions[type][index] = newPos;
    setActivePlay(newPlay);
  };

  const handleAddOption = () => {
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    const defaultSet = SET_TEMPLATES[activePlay.rosterSize].find(s => s.id === activePlay.setId);
    newPlay.options.push({
      id: Date.now().toString(), name: 'New Option',
      steps: [{ id: 's1', instruction: 'Start', positions: JSON.parse(JSON.stringify(defaultSet.positions)) }]
    });
    setActivePlay(newPlay);
    setActiveOptionIndex(newPlay.options.length - 1);
    setCurrentStepIndex(0);
  };

  const handleOptionNameChange = (text) => {
    const newPlay = JSON.parse(JSON.stringify(activePlay));
    newPlay.options[activeOptionIndex].name = text;
    setActivePlay(newPlay);
  };

  const renderLibrary = () => {
    const availableSets = SET_TEMPLATES[rosterSizeFilter];
    return (
      <div className="flex flex-col gap-6 max-w-md w-full mx-auto pb-4">
        <div className="flex bg-[#E5E5EA] p-1 rounded-lg w-full">
          {[1, 2, 3, 4, 5].map((num) => (
            <button key={num} onClick={() => setRosterSizeFilter(num)} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${rosterSizeFilter === num ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}>{num}v{num}</button>
          ))}
        </div>
        <button onClick={handleCreateBlank} className="flex items-center justify-center gap-2 w-full py-3 bg-ios-surface border border-ios-blue text-ios-blue rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm">
          <Plus size={20} /> Create {rosterSizeFilter}v{rosterSizeFilter} Play
        </button>
        <div className="flex flex-col gap-6">
          {availableSets.map(set => {
            const playsInSet = plays.filter(p => p.setId === set.id && p.rosterSize === rosterSizeFilter);
            return (
              <div key={set.id}>
                <h2 className="text-xs font-bold text-ios-gray uppercase px-4 mb-2 tracking-wider">{set.name}</h2>
                {playsInSet.length > 0 ? (
                  <div className="bg-ios-surface rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    {playsInSet.map((play, index) => (
                      <div key={play.id} onClick={() => handleOpenPlay(play)} className={`flex items-center justify-between p-4 bg-white active:bg-gray-50 cursor-pointer ${index !== playsInSet.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div>
                          <h3 className="font-semibold text-ios-dark">{play.name}</h3>
                          <p className="text-xs text-ios-gray mt-0.5">{play.options.length} Reads • {play.desc}</p>
                        </div>
                        <ChevronRight size={20} className="text-ios-gray" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 px-4 italic">No plays saved in this set.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCourtScreen = () => {
    const isEditing = playsScreen === 'edit';
    const activeSteps = activePlay.options[activeOptionIndex].steps;
    const currentStep = activeSteps[currentStepIndex];

    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => { stopPlayback(); isEditing ? setPlaysScreen('view') : setPlaysScreen('library'); }} className="flex items-center text-ios-blue font-medium active:opacity-50">
            <ChevronLeft size={24} className="-ml-2" />
            <span>{isEditing && plays.find(p => p.id === activePlay.id) ? 'Cancel' : 'Library'}</span>
          </button>
          <span className="text-sm font-semibold text-ios-dark uppercase tracking-wider">{isEditing ? 'Editor' : 'Play View'}</span>
          {isEditing ? (
            <button onClick={handleSavePlay} className="flex items-center gap-1 text-ios-green font-medium active:opacity-50"><Check size={18} /> Save</button>
          ) : <div className="w-[72px]"></div>}
        </div>

        {isEditing && (
          <div className="flex flex-col gap-2 w-full max-w-sm mx-auto bg-ios-surface p-4 rounded-xl border border-gray-100 shadow-sm">
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="font-semibold text-ios-dark border-b border-gray-200 pb-1 focus:outline-none focus:border-ios-blue" placeholder="Play Name" />
            <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="text-sm text-ios-gray border-b border-gray-200 pb-1 focus:outline-none focus:border-ios-blue" placeholder="Short description..." />
          </div>
        )}

        {!isEditing && (
          <div className="flex flex-col items-center mb-1">
            <h2 className="text-2xl font-bold text-ios-dark">{activePlay.name}</h2>
            <div className="flex gap-2 w-full max-w-sm mt-3">
              <button onClick={handleEditPlay} className="flex-1 flex items-center justify-center gap-2 py-2 bg-ios-surface border border-gray-200 text-ios-dark rounded-lg text-sm font-medium active:bg-gray-50"><Edit3 size={16} /> Edit</button>
              <button onClick={handleUseTemplate} className="flex-1 flex items-center justify-center gap-2 py-2 bg-ios-surface border border-gray-200 text-ios-dark rounded-lg text-sm font-medium active:bg-gray-50"><Copy size={16} /> Clone</button>
              <button onClick={() => { setPlays(plays.filter(p => p.id !== activePlay.id)); setPlaysScreen('library'); }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium active:bg-red-100"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm mx-auto">
          {/* iOS Read Chooser Segmented Control */}
          <div className="flex gap-1 overflow-x-auto bg-[#E5E5EA] p-1 rounded-lg w-full mb-3" style={{ scrollbarWidth: 'none' }}>
            {activePlay.options.map((opt, idx) => (
              <button 
                key={opt.id} 
                onClick={() => { stopPlayback(); setActiveOptionIndex(idx); setCurrentStepIndex(0); }}
                className={`flex-1 whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeOptionIndex === idx ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2 mb-3">
              <input value={activePlay.options[activeOptionIndex].name} onChange={(e) => handleOptionNameChange(e.target.value)} className="flex-1 text-sm font-semibold text-ios-dark bg-ios-surface px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-ios-blue" placeholder="Option Name" />
              <button onClick={handleAddOption} className="px-3 py-2 bg-ios-blue text-white rounded-lg text-xs font-bold active:bg-blue-600 shadow-sm flex items-center gap-1"><Plus size={14} /> Read</button>
            </div>
          )}

          <div className="bg-ios-surface rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-100">
              <button onClick={() => { stopPlayback(); setCurrentStepIndex(Math.max(0, currentStepIndex - 1)); }} disabled={currentStepIndex === 0 || isPlaying} className={`p-2 rounded-lg ${currentStepIndex === 0 || isPlaying ? 'text-gray-300' : 'text-ios-blue active:bg-blue-50'}`}><ArrowLeft size={20} /></button>
              
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} disabled={activeSteps.length <= 1} className={`flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm transition-colors ${activeSteps.length <= 1 ? 'bg-gray-300' : 'bg-ios-blue active:bg-blue-600'}`}>
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>
                <span className="text-xs font-bold text-ios-gray uppercase tracking-wider min-w-[70px] text-center">
                  {isPlaying ? 'Playing...' : `${currentStepIndex + 1} of ${activeSteps.length}`}
                </span>
              </div>

              <button onClick={() => { stopPlayback(); setCurrentStepIndex(Math.min(activeSteps.length - 1, currentStepIndex + 1)); }} disabled={currentStepIndex === activeSteps.length - 1 || isPlaying} className={`p-2 rounded-lg ${currentStepIndex === activeSteps.length - 1 || isPlaying ? 'text-gray-300' : 'text-ios-blue active:bg-blue-50'}`}><ArrowRight size={20} /></button>
            </div>
            <div className="p-4">
              {isEditing ? (
                <textarea value={currentStep.instruction} onChange={(e) => handleInstructionChange(e.target.value)} className="w-full text-sm text-ios-dark resize-none focus:outline-none" rows={2} placeholder="Describe the action in this step..." />
              ) : <p className="text-sm text-ios-dark text-center font-medium leading-relaxed">{isPlaying ? 'Simulating Play...' : currentStep.instruction}</p>}
            </div>
          </div>
        </div>

        <Court 
          rosterSize={activePlay.rosterSize} 
          positions={currentStep.positions} 
          allSteps={activeSteps}
          isPlaying={isPlaying}
          readOnly={!isEditing} 
          onUpdatePosition={handleUpdatePosition}
        />

        <div className="flex justify-center gap-5 text-[10px] font-bold text-ios-gray uppercase mt-1">
           <span className="flex items-center gap-1"><div className="flex items-center"><div className="w-3 border-t border-[#8E8E93] border-dashed"></div><div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[4px] border-l-[#8E8E93]"></div></div> Pass</span>
           <span className="flex items-center gap-1"><div className="flex items-center"><div className="w-3 border-t border-[#007AFF]"></div><div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[4px] border-l-[#007AFF]"></div></div> Cut</span>
           <span className="flex items-center gap-1"><div className="flex items-center"><div className="w-3 border-t border-[#34C759]"></div><div className="w-1 h-3 bg-[#34C759]"></div></div> Screen</span>
        </div>

        {isEditing && (
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto mt-2 pb-6">
            <div className="flex gap-2">
              <button onClick={() => { stopPlayback(); handleAddStep(); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-ios-blue text-white rounded-xl font-semibold active:bg-blue-600 shadow-sm"><Plus size={18} /> Duplicate & Add Next Step</button>
              {activeSteps.length > 1 && (
                <button onClick={() => { stopPlayback(); handleDeleteStep(); }} className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 active:bg-red-100"><Trash2 size={20} /></button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-ios-bg">
      <div className="bg-ios-surface pt-12 pb-4 px-6 shadow-sm z-10 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">{activeTab === 'plays' ? 'Hoopbook' : 'Settings'}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {activeTab === 'plays' && (playsScreen === 'library' ? renderLibrary() : renderCourtScreen())}
      </div>
      <div className="bg-ios-surface border-t border-gray-200 pb-8 pt-3 px-6 flex justify-between items-center z-10 flex-shrink-0">
        <button onClick={() => { stopPlayback(); setActiveTab('plays'); }} className={`flex flex-col items-center transition-colors ${activeTab === 'plays' ? 'text-ios-blue' : 'text-ios-gray'}`}><Play size={24} /><span className="text-xs font-medium mt-1">Plays</span></button>
        <button onClick={() => { stopPlayback(); setActiveTab('film'); }} className={`flex flex-col items-center transition-colors ${activeTab === 'film' ? 'text-ios-blue' : 'text-ios-gray'}`}><Video size={24} /><span className="text-xs font-medium mt-1">Film Room</span></button>
        <button onClick={() => { stopPlayback(); setActiveTab('settings'); }} className={`flex flex-col items-center transition-colors ${activeTab === 'settings' ? 'text-ios-blue' : 'text-ios-gray'}`}><Settings size={24} /><span className="text-xs font-medium mt-1">Settings</span></button>
      </div>
    </div>
  );
}