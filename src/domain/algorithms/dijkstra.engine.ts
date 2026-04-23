export interface Edge {
    from: string;
    to: string;
    cost: number;
    time: number;
    type: 'highway' | 'local';
  }
  
  export class DijkstraEngine {
    static calculate(
      edges: Edge[],
      start: string,
      end: string,
      preference: 'shortest' | 'fastest',
      constraints?: { avoidHighways?: boolean }
    ) {
      const graph = new Map<string, { node: string; weight: number }[]>();
      const nodes = new Set<string>();
  
      // Construcción del grafo filtrado
      edges.forEach((edge) => {
        if (constraints?.avoidHighways && edge.type === 'highway') return;
  
        const weight = preference === 'fastest' ? edge.time : edge.cost;
        if (!graph.has(edge.from)) graph.set(edge.from, []);
        graph.get(edge.from).push({ node: edge.to, weight });
        nodes.add(edge.from);
        nodes.add(edge.to);
      });
  
      const distancia: Record<string, number> = {};
      const previo: Record<string, string | null> = {};
      const queue = new Set<string>();
  
      nodes.forEach((node) => {
        distancia[node] = Infinity;
        previo[node] = null;
        queue.add(node);
      });
      distancia[start] = 0;
  
      while (queue.size > 0) {
        const u = Array.from(queue).reduce((minNode, node) =>
          distancia[node] < distancia[minNode] ? node : minNode
        );
  
        if (u === end || distancia[u] === Infinity) break;
        queue.delete(u);
  
        const neighbors = graph.get(u) || [];
        for (const neighbor of neighbors) {
          const alt = distancia[u] + neighbor.weight;
          if (alt < distancia[neighbor.node]) {
            distancia[neighbor.node] = alt;
            previo[neighbor.node] = u;
          }
        }
      }
  
      return {
        path: this.reconstructPath(previo, end),
        totalCost: distancia[end],
      };
    }
  
    private static reconstructPath(previous: Record<string, string | null>, end: string): string[] {
      const path = [];
      let curr: string | null = end;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
      return path[0] === end && path.length === 1 ? [] : path;
    }
  }
  