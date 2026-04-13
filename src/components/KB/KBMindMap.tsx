import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GraphData } from '../../utils/kb-graph';

interface KBMindMapProps {
  data: GraphData;
}

// ─── Layout Constants ──────────────────────────────────────────────────────────
const NODE_W = 200;
const NODE_H = 44;
const CAT_W  = 180;
const CAT_H  = 44;
const ROOT_W = 200;
const ROOT_H = 52;

const COL_GAP  = 160; // horizontal gap between columns
const ROW_GAP  = 32;  // vertical gap between article nodes
const CAT_GAP  = 60;  // extra vertical gap between category groups

// ─── Geometry helpers ──────────────────────────────────────────────────────────
function buildLayout(tree: { name: string; children: GraphData['nodes'] }[]) {
  // Pass 1: calculate height of each category group
  const groups = tree.map((cat) => {
    const childCount = cat.children.length;
    const groupH = childCount > 0
      ? childCount * NODE_H + (childCount - 1) * ROW_GAP
      : NODE_H;
    return { cat, groupH };
  });

  // Pass 2: total canvas height + vertical offsets
  const totalH = groups.reduce((sum, g) => sum + g.groupH, 0)
    + (groups.length - 1) * CAT_GAP;

  const rootX = 60;
  const rootY = totalH / 2 - ROOT_H / 2;

  const catX = rootX + ROOT_W + COL_GAP;
  const artX = catX + CAT_W + COL_GAP;

  let cursor = 0;
  const positions = groups.map(({ cat, groupH }) => {
    const catY = cursor + groupH / 2 - CAT_H / 2;
    const children = cat.children.map((child, i) => ({
      ...child,
      ax: artX,
      ay: cursor + i * (NODE_H + ROW_GAP),
    }));
    cursor += groupH + CAT_GAP;
    return { name: cat.name, catX, catY, children };
  });

  return { rootX, rootY, positions, totalH, totalW: artX + NODE_W + 60 };
}

// bezier path between two points
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export const KBMindMap: React.FC<KBMindMapProps> = ({ data }) => {
  const tree = useMemo(() => {
    const cats = [...new Set(data.nodes.map((n) => n.category))];
    return cats.map((cat) => ({
      name: cat,
      children: data.nodes.filter((n) => n.category === cat),
    }));
  }, [data]);

  const layout = useMemo(() => buildLayout(tree), [tree]);

  // ── pan/zoom state ────────────────────────────────────────────────────────
  const [offset, setOffset] = useState({ x: 80, y: 60 });
  const [scale, setScale]   = useState(1);
  const dragging = useRef(false);
  const lastPos  = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // centre the canvas initially after mount
  useEffect(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setOffset({
      x: Math.max(60, (clientWidth  - layout.totalW * scale) / 2),
      y: Math.max(60, (clientHeight - layout.totalH * scale) / 2),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.totalW, layout.totalH]);

  // drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  // zoom via wheel
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((s) => Math.min(2.5, Math.max(0.3, s * factor)));
  }, []);

  // ── derived geometry for SVG paths ────────────────────────────────────────
  const { rootX, rootY, positions, totalH, totalW } = layout;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-bg-base overflow-hidden select-none"
      style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* ── Infinite canvas ──────────────────────────────────────────────── */}
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: totalW,
          height: totalH,
          position: 'absolute',
        }}
      >
        {/* SVG connections */}
        <svg
          width={totalW}
          height={totalH}
          className="absolute inset-0 pointer-events-none"
          overflow="visible"
        >
          {positions.map((group, gi) => {
            // root → category
            const rootMidX = rootX + ROOT_W;
            const rootMidY = rootY + ROOT_H / 2;
            const catMidY  = group.catY + CAT_H / 2;

            return (
              <g key={`g-${gi}`}>
                {/* root → cat */}
                <motion.path
                  d={bezier(rootMidX, rootMidY, group.catX, catMidY)}
                  stroke="hsl(var(--text-main) / 0.12)"
                  strokeWidth={1.5}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: gi * 0.1 }}
                />

                {/* cat → articles */}
                {group.children.map((child, ci) => {
                  const childMidY = child.ay + NODE_H / 2;
                  return (
                    <motion.path
                      key={`p-${child.id}`}
                      d={bezier(group.catX + CAT_W, catMidY, child.ax, childMidY)}
                      stroke="hsl(var(--text-main) / 0.08)"
                      strokeWidth={1}
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 + gi * 0.1 + ci * 0.04 }}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* ── Root node ─────────────────────────────────────────────────── */}
        <motion.div
          className="absolute flex items-center justify-center rounded-full border border-white/20"
          style={{
            left: rootX, top: rootY,
            width: ROOT_W, height: ROOT_H,
            background: 'hsl(var(--accent-primary))',
            boxShadow: '0 0 32px hsl(var(--accent-primary) / 0.2)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className="text-bg-base font-serif italic text-base tracking-wide">
            知识库
          </span>
        </motion.div>

        {/* ── Category + Article nodes ──────────────────────────────────── */}
        {positions.map((group, gi) => (
          <React.Fragment key={`group-${gi}`}>
            {/* Category node */}
            <motion.div
              className="absolute flex items-center gap-2.5 px-4 rounded-lg border border-border-muted"
              style={{
                left: group.catX, top: group.catY,
                width: CAT_W, height: CAT_H,
                background: 'hsl(var(--text-main) / 0.04)',
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + gi * 0.1, duration: 0.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                   style={{ background: 'hsl(var(--accent-primary))' }} />
              <span className="text-text-main text-sm font-medium tracking-wide truncate opacity-80">
                {group.name}
              </span>
            </motion.div>

            {/* Article nodes */}
            {group.children.map((child, ci) => (
              <motion.a
                key={child.id}
                href={`/kb/${child.id}`}
                className="absolute flex items-center gap-2 px-4 rounded-md border border-border-muted group"
                style={{
                  left: child.ax, top: child.ay,
                  width: NODE_W, height: NODE_H,
                  background: 'hsl(var(--text-main) / 0.02)',
                  pointerEvents: 'auto',
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + gi * 0.1 + ci * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                onMouseDown={(e) => e.stopPropagation()} // don't start drag on click
              >
                <span className="text-text-main/40 group-hover:text-text-main/90 text-xs tracking-wide truncate transition-colors duration-300 flex-1">
                  {child.name}
                </span>
                <svg className="opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0"
                     width="10" height="10" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* ── Dot grid (fixed, decorative) ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--text-main)) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── HUD Labels ─────────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-8 z-50 pointer-events-none font-sans space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1px] bg-accent/30" />
          <span className="text-text-main/30 text-[9px] uppercase tracking-[0.5em]">
            Horizontal Mind Map
          </span>
        </div>
        <p className="text-text-main/20 text-[9px] tracking-widest pl-9">
          Drag · Scroll to zoom
        </p>
      </div>

      {/* ── Zoom indicator ─────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 right-8 z-50 pointer-events-none font-sans">
        <span className="text-text-main/25 text-[9px] tabular-nums tracking-widest">
          {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
};
