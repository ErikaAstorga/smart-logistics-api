import { Injectable, NotFoundException } from '@nestjs/common';
import { Edge } from '../domain/algorithms/dijkstra.engine';

@Injectable()
export class NetworkService {
  // Mapa para guardar: ID -> Lista de Edges
  private networks = new Map<string, Edge[]>();
  private historyIds: string[] = [];
  private readonly MAX_HISTORY = 5;

  uploadNetwork(edges: Edge[]): string {
    const id = `uuid-${Math.random().toString(36).substring(2, 9)}`;

    // Manejo circular de las últimas 5 redes
    if (this.historyIds.length >= this.MAX_HISTORY) {
      const oldestId = this.historyIds.shift();
      this.networks.delete(oldestId!);
    }

    this.networks.set(id, edges);
    this.historyIds.push(id);
    return id;
  }

  getNetwork(id: string): Edge[] {
    const network = this.networks.get(id);
    if (!network) throw new NotFoundException(`Network with ID ${id} not found`);
    return network;
  }

  getNodes(id: string): string[] {
    const edges = this.getNetwork(id);
    const nodes = new Set<string>();
    edges.forEach(e => {
      nodes.add(e.from);
      nodes.add(e.to);
    });
    return Array.from(nodes);
  }
}
