import React, { useRef, useState, useEffect } from 'react';

interface InteractiveRigCanvasProps {
  primaryHex: string;
  secondaryHex: string;
  cpuName: string;
  gpuName: string;
  ramText: string;
  coolerText: string;
  isCompact?: boolean;
}

export const InteractiveRigCanvas: React.FC<InteractiveRigCanvasProps> = ({
  primaryHex,
  secondaryHex,
  cpuName,
  gpuName,
  ramText,
  coolerText,
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ rx: 8, ry: -14 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeZone, setActiveZone] = useState<'case' | 'gpu' | 'cpu' | 'ram' | 'rgb' | null>(null);

  // Smooth mouse move 3D tilt tracking (compositor friendly, no lag)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized -1 to +1
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;

    // Subtle restrained tilt angles (max +/- 12 deg for elegance & zero dizziness)
    setRotation({
      rx: -(ny * 12),
      ry: nx * 18,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveZone(null);
    setRotation({ rx: 6, ry: -12 });
  };

  // Touch support for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const nx = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));
    setRotation({
      rx: -(ny * 10),
      ry: nx * 14,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setRotation({ rx: 6, ry: -12 })}
      className={`relative w-full ${isCompact ? 'h-64 sm:h-72' : 'h-80 sm:h-96'} rounded-3xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none`}
      style={{
        perspective: '1200px',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(10,13,20,0.95) 85%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: `0 20px 50px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Dynamic 3D ambient floor grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 75%)',
          transform: `rotateX(60deg) translateY(40px) scale(1.6)`,
        }}
      />

      {/* Reactive Ambient Glow directly tied to active theme */}
      <div
        className="absolute w-72 h-72 rounded-full blur-[90px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, ${primaryHex} 0%, ${secondaryHex} 60%, transparent 100%)`,
          opacity: isHovered ? 0.3 : 0.16,
          transform: `translate(${rotation.ry * 3}px, ${-rotation.rx * 3}px)`,
        }}
      />

      {/* 3D Hardware Chassis Assembly */}
      <div
        className="relative transition-transform ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg)`,
          transitionDuration: isHovered ? '60ms' : '500ms',
          width: isCompact ? '260px' : '310px',
          height: isCompact ? '210px' : '260px',
        }}
      >
        {/* Chassis Shadow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-12 rounded-full blur-xl pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            transform: 'translateZ(-40px) rotateX(85deg)',
          }}
        />

        {/* Main Computer Glass Panel Case Layer */}
        <div
          className="absolute inset-0 rounded-2xl border backdrop-blur-[2px] transition-colors"
          style={{
            backgroundColor: 'rgba(16, 20, 30, 0.82)',
            borderColor: activeZone === 'case' ? primaryHex : 'rgba(255, 255, 255, 0.12)',
            boxShadow: `0 15px 35px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
            transform: 'translateZ(10px)',
          }}
        >
          {/* Top Chassis Air Intake Vents */}
          <div className="absolute top-2.5 left-4 right-4 flex items-center justify-between opacity-60">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <div className="text-[9px] font-mono tracking-wider text-slate-400">
              ATX DUAL-CHAMBER
            </div>
          </div>

          {/* Motherboard Backplate */}
          <div
            className="absolute top-9 left-4 right-4 bottom-4 rounded-xl border border-white/[0.06] bg-[#0c0f17] p-3 flex flex-col justify-between"
            style={{ transform: 'translateZ(15px)' }}
          >
            {/* Upper Zone: CPU Socket & AIO Cooler Block */}
            <div className="flex items-center justify-between gap-2">
              {/* CPU & Cooler Block */}
              <div
                onMouseEnter={() => setActiveZone('cpu')}
                onMouseLeave={() => setActiveZone(null)}
                className="flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer group"
                style={{
                  borderColor: activeZone === 'cpu' ? primaryHex : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: activeZone === 'cpu' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  transform: 'translateZ(25px)',
                }}
              >
                {/* Circular AIO Infinity Mirror Ring */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center relative shrink-0"
                  style={{
                    background: 'radial-gradient(circle, #080a10 40%, rgba(255,255,255,0.05) 100%)',
                    border: `1.5px solid ${primaryHex}`,
                    boxShadow: `0 0 14px ${primaryHex}40`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-dashed animate-spin"
                    style={{
                      borderColor: secondaryHex,
                      animationDuration: '10s',
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    CPU & Pump
                  </div>
                  <div className="text-[11px] font-bold text-slate-100 truncate group-hover:text-white">
                    {cpuName || 'AMD / Intel CPU'}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    {coolerText || '240mm AIO Cooler'}
                  </div>
                </div>
              </div>

              {/* RAM Modules with RGB Lightbar */}
              <div
                onMouseEnter={() => setActiveZone('ram')}
                onMouseLeave={() => setActiveZone(null)}
                className="flex flex-col gap-1 p-2 rounded-xl border transition-all cursor-pointer group shrink-0"
                style={{
                  borderColor: activeZone === 'ram' ? secondaryHex : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: activeZone === 'ram' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  transform: 'translateZ(25px)',
                }}
              >
                <div className="text-[8px] font-mono text-slate-400 uppercase text-center">
                  RAM
                </div>
                <div className="flex gap-1 justify-center">
                  <span
                    className="w-1.5 h-6 rounded-sm shadow-sm"
                    style={{
                      backgroundColor: primaryHex,
                      boxShadow: `0 0 6px ${primaryHex}`,
                    }}
                  />
                  <span
                    className="w-1.5 h-6 rounded-sm shadow-sm"
                    style={{
                      backgroundColor: secondaryHex,
                      boxShadow: `0 0 6px ${secondaryHex}`,
                    }}
                  />
                </div>
                <div className="text-[9px] font-mono text-slate-300 text-center font-bold">
                  {ramText || '32GB'}
                </div>
              </div>
            </div>

            {/* Lower Zone: Dedicated Triple-Fan GPU Card */}
            <div
              onMouseEnter={() => setActiveZone('gpu')}
              onMouseLeave={() => setActiveZone(null)}
              className="mt-2.5 p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between"
              style={{
                borderColor: activeZone === 'gpu' ? primaryHex : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: activeZone === 'gpu' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.02)',
                transform: 'translateZ(35px)',
                boxShadow: activeZone === 'gpu' ? `0 8px 20px -4px ${primaryHex}30` : 'none',
              }}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    PCIe Gen 5 GPU
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 truncate group-hover:text-white">
                  {gpuName || 'RTX 4070 SUPER'}
                </div>
              </div>

              {/* Triple Fan Shroud Simulation */}
              <div className="flex items-center gap-1 shrink-0">
                {[0, 1, 2].map((fanIdx) => (
                  <div
                    key={fanIdx}
                    className="w-6 h-6 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.06) 20%, transparent 80%)',
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-slate-600"
                      style={{
                        animation: isHovered ? 'spin 1.2s linear infinite' : 'spin 3.5s linear infinite',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating 3D Interaction Hint Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-[#090b10]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08]">
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: primaryHex }}
        />
        <span>Hover or drag to rotate 3D rig</span>
      </div>
    </div>
  );
};
