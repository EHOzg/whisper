import type { CollectionEntry } from 'astro:content';

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  val: number; // Node size
  randomFactor: number; // For size/appearance entropy
  phaseOffset: number; // For animation sync offsets
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function generateGraphData(entries: CollectionEntry<'kb'>[]): GraphData {
  const nodes: GraphNode[] = entries.map(entry => {
    // Is it a "main" node? (Simplified: first in order)
    const isMain = entry.data.order === 1;
    return {
      id: entry.id,
      name: entry.data.title,
      category: entry.data.category,
      val: isMain ? 4 : 1.5 + Math.random() * 2,
      randomFactor: Math.random(),
      phaseOffset: Math.random() * Math.PI * 2
    };
  });

  const links: GraphLink[] = [];

  // Grouped logic: link entries within the same category
  const categories = [...new Set(entries.map(e => e.data.category))];
  categories.forEach(cat => {
    const catEntries = entries.filter(e => e.data.category === cat);
    // Link to the next one in order to form a chain/category cluster
    for (let i = 0; i < catEntries.length - 1; i++) {
        links.push({
            source: catEntries[i].id,
            target: catEntries[i+1].id
        });
    }
  });

  // Simple scan for cross-references in content (simplified placeholder for now)
  // Real implementation could use a regex to scan for markdown links
  entries.forEach(entry => {
    // If entry's description mentions another entry's title, link them
    entries.forEach(other => {
        if (entry.id !== other.id && entry.data.description.includes(other.data.title)) {
            links.push({ source: entry.id, target: other.id });
        }
    });
  });

  return { nodes, links };
}
