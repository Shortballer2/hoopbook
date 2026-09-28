import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Court({ rosterSize, positions, readOnly, onUpdatePosition, allSteps, isPlaying }) {
  const courtRef = useRef(null);

  const fullOffense = ['1', '2', '3', '4', '5'];
  const fullDefense = ['X1', 'X2', 'X3', 'X4', 'X5'];

  const offense = fullOffense.slice(0, rosterSize);
  const defense = fullDefense.slice(0, rosterSize);

  const getDefaultPos = (type, index) => ({
    x: 50 + (index - (rosterSize - 1) / 2) * 15, 
    y: type === 'offense' ? 85 : 65
  });

  const { offense: offPos, defense: defPos, ball, lines } = positions || {};

  const handleDragEnd = (type, index, info) => {
    if (readOnly || !onUpdatePosition || !courtRef.current) return;
    
    const rect = courtRef.current.getBoundingClientRect();
    let newX = ((info.point.x - rect.left) / rect.width) * 100;
    let newY = ((info.point.y - rect.top) / rect.height) * 100;
    
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    onUpdatePosition(type, index, { x: newX, y: newY });
  };

  // Helper to extract positions safely across all steps
  const getPos = (stepData, type, index) => {
    if (type === 'ball') return stepData?.ball || { x: 50, y: 50 };
    if (stepData?.[type]?.[index]) return stepData[type][index];
    return getDefaultPos(type, index);
  };

  // If playing, we pass an ARRAY of coordinates to Framer Motion to create a continuous keyframe animation
  const getAnimateProps = (type, index) => {
    if (isPlaying && allSteps && allSteps.length > 1) {
      return {
        left: allSteps.map(step => `${getPos(step.positions, type, index).x}%`),
        top: allSteps.map(step => `${getPos(step.positions, type, index).y}%`)
      };
    }
    // Standard step-by-step fallback
    const pos = getPos(positions, type, index);
    return { left: `${pos.x}%`, top: `${pos.y}%` };
  };

  // If playing, calculate total time based on 1.5s per transition phase. 'Linear' ensures a steady running speed.
  const getTransition = () => {
    if (isPlaying && allSteps && allSteps.length > 1) {
      return { duration: (allSteps.length - 1) * 1.5, ease: "linear" };
    }
    return { type: "spring", stiffness: 200, damping: 22 };
  };

  return (
    <div 
      ref={courtRef}
      className="relative w-full max-w-lg mx-auto aspect-[50/47] bg-[#E3C79B] border-2 border-[#A87B4E] rounded-md overflow-hidden shadow-md touch-none"
    >
      <svg viewBox="0 0 50 47" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <marker id="arrow-cut" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M 2 1 L 8 5 L 2 9 z" style={{ fill: '#007AFF', stroke: 'none' }} />
          </marker>
          <marker id="arrow-pass" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M 2 1 L 8 5 L 2 9 z" style={{ fill: '#8E8E93', stroke: 'none' }} />
          </marker>
          <marker id="screen-bar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M 8 1 L 8 9" style={{ stroke: '#34C759', strokeWidth: 2, fill: 'none', strokeLinecap: 'square' }} />
          </marker>
        </defs>

        <g style={{ stroke: 'rgba(255, 255, 255, 0.8)', strokeWidth: 0.25, fill: 'none' }}>
          <rect x="0" y="0" width="50" height="47" strokeWidth="0.5" />
          <rect x="17" y="0" width="16" height="19" style={{ fill: '#C59B65' }} />
          <line x1="22" y1="4" x2="28" y2="4" strokeWidth="0.5" style={{ stroke: '#333333' }} />
          <circle cx="25" cy="4.75" r="0.75" style={{ stroke: '#DE5C34' }} />
          <path d="M 17 19 A 8 8 0 0 0 33 19" />
          <path d="M 17 19 A 8 8 0 0 1 33 19" strokeDasharray="0.5, 1" />
          <line x1="3" y1="0" x2="3" y2="14" />
          <line x1="47" y1="0" x2="47" y2="14" />
          <path d="M 3 14 A 23.75 23.75 0 0 0 47 14" />
        </g>
        
        {/* Hide diagram lines when the video is playing for a cleaner live-action look */}
        {!isPlaying && lines && lines.map((line, i) => {
          const isPass = line.type === 'pass';
          const isScreen = line.type === 'screen';
          
          const absX1 = (line.start.x / 100) * 50;
          const absY1 = (line.start.y / 100) * 47;
          const absX2 = (line.end.x / 100) * 50;
          const absY2 = (line.end.y / 100) * 47;

          const dx = absX2 - absX1;
          const dy = absY2 - absY1;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          const offset = 1.6; 
          if (length <= offset * 2) return null; 

          const startRatio = offset / length;
          const endRatio = (length - offset) / length;

          const adjX1 = absX1 + dx * startRatio;
          const adjY1 = absY1 + dy * startRatio;
          const adjX2 = absX1 + dx * endRatio;
          const adjY2 = absY1 + dy * endRatio;

          const color = isPass ? '#8E8E93' : isScreen ? '#34C759' : '#007AFF';
          const marker = isPass ? 'url(#arrow-pass)' : isScreen ? 'url(#screen-bar)' : 'url(#arrow-cut)';

          return (
            <line 
              key={i} x1={adjX1} y1={adjY1} x2={adjX2} y2={adjY2} 
              style={{ stroke: color, strokeWidth: isPass ? 0.3 : 0.4, strokeDasharray: isPass ? "0.8, 0.8" : "none" }}
              markerEnd={marker}
            />
          );
        })}
      </svg>

      {offense.map((player, index) => (
        <motion.div
          key={`off-${player}`}
          drag={!readOnly}
          dragConstraints={courtRef}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('offense', index, info)}
          initial={false} // Prevents snapping bugs when keyframes activate
          animate={getAnimateProps('offense', index)}
          transition={getTransition()}
          className={`absolute flex items-center justify-center w-7 h-7 -ml-[14px] -mt-[14px] bg-ios-blue text-white rounded-full font-semibold text-xs shadow-md touch-none z-10 ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
        >
          {player}
        </motion.div>
      ))}

      {defense.map((player, index) => (
        <motion.div
          key={`def-${player}`}
          drag={!readOnly}
          dragConstraints={courtRef}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('defense', index, info)}
          initial={false}
          animate={getAnimateProps('defense', index)}
          transition={getTransition()}
          className={`absolute flex items-center justify-center w-7 h-7 -ml-[14px] -mt-[14px] bg-ios-surface border-2 border-ios-gray text-ios-gray rounded-full font-bold text-[10px] shadow-sm touch-none z-10 ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
        >
          {player}
        </motion.div>
      ))}

      {ball && (
        <motion.div
          drag={!readOnly}
          dragConstraints={courtRef}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('ball', 0, info)}
          initial={false}
          animate={getAnimateProps('ball', 0)}
          transition={getTransition()}
          className={`absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] bg-[#E55B3C] rounded-full border border-[#B33920] shadow-md z-20 ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
        />
      )}
    </div>
  );
}