import type { CollectionEntry } from 'astro:content';
import type { Node, Edge } from '@xyflow/react';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function generateGraphData(entries: CollectionEntry<'kb'>[]): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create a simple circular layout based on categories
  const categories = [...new Set(entries.map(e => e.data.category))];
  const radiusX = 400;
  const radiusY = 300;
  const centerX = 500;
  const centerY = 400;

  entries.forEach((entry, idx) => {
    const isMain = entry.data.order === 1;
    const catIndex = categories.indexOf(entry.data.category);
    
    // Group by category using angle
    const angle = (catIndex / categories.length) * 2 * Math.PI + (idx * 0.2);
    
    // Initial deterministic positions before user moving
    const x = centerX + Math.cos(angle) * (radiusX + (Math.random() * 50));
    const y = centerY + Math.sin(angle) * (radiusY + (Math.random() * 50));

    nodes.push({
      id: entry.id,
      position: { x, y },
      data: { 
        label: entry.data.title,
        category: entry.data.category,
        isMain
      },
      type: 'customNode',
    });
  });

  // Grouped logic: link entries within the same category
  categories.forEach(cat => {
    const catEntries = entries.filter(e => e.data.category === cat);
    // Link to the next one in order to form a chain/category cluster
    for (let i = 0; i < catEntries.length - 1; i++) {
        edges.push({
            id: `edge-${catEntries[i].id}-${catEntries[i+1].id}`,
            source: catEntries[i].id,
            target: catEntries[i+1].id,
            animated: true,
            style: { stroke: '#4b5563', strokeWidth: 1.5 },
        });
    }
  });

  // Simple scan for cross-references in content
  entries.forEach(entry => {
    entries.forEach(other => {
        if (entry.id !== other.id && entry.data.description.includes(other.data.title)) {
            edges.push({ 
              id: `edge-ref-${entry.id}-${other.id}`,
              source: entry.id, 
              target: other.id,
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5,5' },
            });
        }
    });
  });

  return { nodes, edges };
}
