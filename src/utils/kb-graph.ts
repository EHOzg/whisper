import type { CollectionEntry } from 'astro:content';
import type { Node, Edge } from '@xyflow/react';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function generateGraphData(entries: CollectionEntry<'kb'>[]): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 1. Root Node (根节点)
  const rootId = 'root';
  nodes.push({
    id: rootId,
    position: { x: 800, y: 80 }, // Center root node at the top
    data: { 
      label: '知识库',
      isMain: true
    },
    type: 'customNode',
  });

  // Get unique categories
  const categories = [...new Set(entries.map(e => e.data.category))];
  
  // Sort categories to keep layout consistent
  categories.sort();

  // 2. Category Hub Nodes and 3. Document Nodes
  const spacingX = 350; // Spacing between category hubs
  const startX = 800 - ((categories.length - 1) * spacingX) / 2;

  categories.forEach((cat, catIndex) => {
    const catId = `cat-${catIndex}`;
    const catX = startX + catIndex * spacingX;
    const catY = 260;

    // Create Category Hub Node
    nodes.push({
      id: catId,
      position: { x: catX, y: catY },
      data: { 
        label: cat,
        isMain: true
      },
      type: 'customNode',
    });

    // Edge from Root to Category Hub
    edges.push({
      id: `edge-root-${catId}`,
      source: rootId,
      target: catId,
      animated: true,
      style: { stroke: '#8c7861', strokeWidth: 2 }, // Accent Sepia color
    });

    // Get documents in this category
    const catEntries = entries
      .filter(e => e.data.category === cat)
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));

    const numDocs = catEntries.length;
    const docSpacingX = 180;
    const docStartX = catX - ((numDocs - 1) * docSpacingX) / 2;

    catEntries.forEach((entry, docIndex) => {
      const docX = docStartX + docIndex * docSpacingX;
      // Stagger documents vertically slightly to look more dynamic and avoid crowding
      const docY = 440 + (docIndex % 2) * 40; 

      // Create Document Node
      nodes.push({
        id: entry.id,
        position: { x: docX, y: docY },
        data: { 
          label: entry.data.title,
          category: entry.data.category,
          isMain: false
        },
        type: 'customNode',
      });

      // Edge from Category Hub to Document Node
      edges.push({
        id: `edge-${catId}-${entry.id}`,
        source: catId,
        target: entry.id,
        animated: true,
        style: { stroke: '#9ca3af', strokeWidth: 1.5 },
      });
    });
  });

  // Link cross-references (lateral connections)
  entries.forEach(entry => {
    entries.forEach(other => {
        if (entry.id !== other.id && entry.data.description.includes(other.data.title)) {
            edges.push({ 
              id: `edge-ref-${entry.id}-${other.id}`,
              source: entry.id, 
              target: other.id,
              animated: true,
              style: { stroke: '#818cf8', strokeWidth: 1.5, strokeDasharray: '5,5' },
            });
        }
    });
  });

  return { nodes, edges };
}
