'use client';

import * as React from 'react';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows, PresentationControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Ruler, ShieldCheck, Sparkles, ChevronRight, Check } from 'lucide-react';

const SUIT_MODEL_URL = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/mannequin/model.gltf';

const lapels = [
  { id: 'notch', name: 'Notch Lapel', description: 'Classic, versatile everyday style' },
  { id: 'peak', name: 'Peak Lapel', description: 'Formal, sophisticated power look' },
  { id: 'shawl', name: 'Shawl Lapel', description: 'Elegant, curved tuxedo style' },
];

const vents = [
  { id: 'single', name: 'Single Vent', description: 'Traditional American aesthetic' },
  { id: 'double', name: 'Double Vent', description: 'Modern British silhouette' },
  { id: 'none', name: 'No Vent', description: 'Sleek, minimalist profile' },
];

function SuitModel({ material, silhouette, lapel, vent }: { material: string, silhouette: string, lapel: string, vent: string }) {
  let model: any = null;
  try {
    model = useGLTF(SUIT_MODEL_URL);
  } catch (e) {
    console.error('Failed to load suit model:', e);
  }
  
  const activeColor = material === 'wool' ? '#1A2B44' : material === 'silk' ? '#C9A962' : '#FCFAF2';
  const roughness = material === 'silk' ? 0.2 : 0.8;

  if (!model || !model.nodes) {
    return (
      <group scale={3} position={[0, -1, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.4, 1, 32]} />
          <meshStandardMaterial 
            color={activeColor}
            roughness={roughness}
            metalness={material === 'silk' ? 0.3 : 0.1}
          />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={activeColor} />
        </mesh>
      </group>
    );
  }

  const { nodes, materials } = model;
  return (
    <group scale={3} position={[0, -1.2, 0]}>
        <mesh 
            geometry={nodes.chair?.geometry || nodes.Object_2?.geometry} 
            material={materials.fabric || materials.Material_0}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial 
                color={activeColor}
                roughness={roughness}
                metalness={material === 'silk' ? 0.3 : 0.1}
            />
        </mesh>
        <Float speed={2} rotationIntensity={0.5}>
            <spotLight position={[5, 5, 5]} intensity={2} color={activeColor} castShadow />
        </Float>
    </group>
  );
}

const silhouettes = [
  { id: 'slim', name: 'Slim Fit', description: 'Modern, tapered silhouette' },
  { id: 'tailored', name: 'Tailored', description: 'Balanced, timeless cut' },
  { id: 'classic', name: 'Classic', description: 'Relaxed, traditional fit' },
];

const materials = [
  { id: 'wool', name: 'Midnight Wool', color: '#1A2B44' },
  { id: 'silk', name: 'Gold Silk', color: '#C9A962' },
  { id: 'cotton', name: 'Ivory Cotton', color: '#FCFAF2' },
];

export function SuitBuilder() {
  const [activeSilhouette, setActiveSilhouette] = useState('slim');
  const [activeMaterial, setActiveMaterial] = useState('wool');
  const [activeLapel, setActiveLapel] = useState('notch');
  const [activeVent, setActiveVent] = useState('double');
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 overflow-hidden">
      {/* 3D Scene Viewport */}
      <div className="flex-[1.5] relative h-[50vh] lg:h-full bg-black">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Suspense fallback={null}>
              <SuitModel 
                material={activeMaterial} 
                silhouette={activeSilhouette} 
                lapel={activeLapel}
                vent={activeVent}
              />
              <Environment preset="city" />
              <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={10} blur={2} far={4.5} />
            </Suspense>
          </PresentationControls>
        </Canvas>

        {/* UI Overlays */}
        <div className="absolute top-8 left-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10"
            >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">Workshop 3D Active</span>
            </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center w-full px-8">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-2"
            >
                Bespoke Masterpiece
            </motion.h2>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-4"
            >
                <div className="h-[1px] w-8 bg-amber-500" />
                <span className="text-amber-500 font-medium uppercase text-xs tracking-[4px]">
                    {activeSilhouette} • {activeMaterial} • {activeLapel}
                </span>
                <div className="h-[1px] w-8 bg-amber-500" />
            </motion.div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex-1 bg-slate-900 border-l border-white/5 flex flex-col">
        {/* Step Indicator */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex gap-6 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {['Silhouette', 'Fabric', 'Lapel', 'Vents', 'Summary'].map((label, idx) => (
              <button 
                key={label}
                onClick={() => setStep(idx + 1)}
                className="relative group transition-all shrink-0"
              >
                <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${step === idx + 1 ? 'text-amber-500' : 'text-slate-400 group-hover:text-white'}`}>
                    {idx + 1} {label}
                </p>
                {step === idx + 1 && (
                    <motion.div layoutId="web-step-underline" className="h-0.5 w-full bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Price Est.</p>
            <p className="text-amber-500 font-bold text-xl font-serif">$1,250</p>
          </div>
        </div>

        {/* Selection Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-8">
                    <Scissors className="w-5 h-5 text-amber-500" />
                    <h3 className="text-white text-2xl font-bold">Select Silhouette</h3>
                </div>
                
                <div className="space-y-4">
                  {silhouettes.map((s) => (
                    <button 
                      key={s.id} 
                      onClick={() => setActiveSilhouette(s.id)}
                      className={`w-full p-6 rounded-3xl border text-left transition-all duration-300 flex items-center justify-between group ${activeSilhouette === s.id ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div>
                        <h4 className={`text-lg font-bold ${activeSilhouette === s.id ? 'text-amber-500' : 'text-white'}`}>{s.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{s.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${activeSilhouette === s.id ? 'bg-amber-500 border-amber-500' : 'border-white/20 group-hover:border-white/40'}`}>
                        {activeSilhouette === s.id && <Check className="w-3.5 h-3.5 text-black font-bold" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-white text-2xl font-bold">Heritage Fabrics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {materials.map((m) => (
                    <button 
                      key={m.id} 
                      onClick={() => setActiveMaterial(m.id)}
                      className={`p-8 rounded-[40px] border text-center transition-all duration-500 group ${activeMaterial === m.id ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div 
                        style={{ backgroundColor: m.color }} 
                        className="w-20 h-20 rounded-full mx-auto mb-6 shadow-2xl border border-black/20 group-hover:scale-110 transition-transform duration-500" 
                      />
                      <h4 className={`text-xs font-bold uppercase tracking-[2px] ${activeMaterial === m.id ? 'text-amber-500' : 'text-slate-300'}`}>
                        {m.name}
                      </h4>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-8">
                    <Ruler className="w-5 h-5 text-amber-500" />
                    <h3 className="text-white text-2xl font-bold">Lapel Configuration</h3>
                </div>
                
                <div className="space-y-4">
                  {lapels.map((l) => (
                    <button 
                      key={l.id} 
                      onClick={() => setActiveLapel(l.id)}
                      className={`w-full p-6 rounded-3xl border text-left transition-all duration-300 flex items-center justify-between group ${activeLapel === l.id ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div>
                        <h4 className={`text-lg font-bold ${activeLapel === l.id ? 'text-amber-500' : 'text-white'}`}>{l.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{l.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-white text-2xl font-bold">Vent Distinction</h3>
                </div>
                
                <div className="space-y-4">
                  {vents.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => setActiveVent(v.id)}
                      className={`w-full p-6 rounded-3xl border text-left transition-all duration-300 flex items-center justify-between group ${activeVent === v.id ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div>
                        <h4 className={`text-lg font-bold ${activeVent === v.id ? 'text-amber-500' : 'text-white'}`}>{v.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{v.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-white text-3xl font-bold mb-2">Style Profile Validated</h3>
                <p className="text-amber-500/60 font-mono text-xs mb-8 uppercase tracking-[4px]">
                    MAL-{activeSilhouette.slice(0,2)}-{activeLapel.slice(0,2)}-{activeVent.slice(0,2)}
                </p>
                <div className="bg-black/40 rounded-[32px] p-8 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Silhouette</span>
                        <span className="text-white font-bold">{activeSilhouette}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Fabric Selection</span>
                        <span className="text-white font-bold">{activeMaterial}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Lapel Detail</span>
                        <span className="text-white font-bold">{activeLapel}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Vent Style</span>
                        <span className="text-white font-bold">{activeVent}</span>
                    </div>
                    <div className="h-[1px] w-full bg-white/5 my-4" />
                    <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Bespoke Total</span>
                        <span className="text-amber-500 font-bold text-2xl font-serif">$1,400.00</span>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="p-10 border-t border-white/5 bg-black/20">
          <button 
            onClick={() => step < 5 ? setStep(step + 1) : null}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold h-16 rounded-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)]"
          >
            <span className="uppercase tracking-[4px] text-xs">
                {step === 1 ? 'Configure Fabric' : step === 2 ? 'Select Lapel' : step === 3 ? 'Choose Vents' : step === 4 ? 'Review Profile' : 'Finalize & Reserve'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest mt-6">
            Handcrafted with excellence in Dar es Salaam
          </p>
        </div>
      </div>
    </div>
  );
}
