import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { NetworkService } from './network/network.service';
import { DijkstraEngine, Edge } from './domain/algorithms/dijkstra.engine'; // UN SOLO IMPORT DE EDGE
import { performance } from 'perf_hooks';
import { Edges } from './domain/algorithms/dijkstra.engine.spec';

// Definimos el DTO aquí mismo para que Swagger funcione
export class UploadNetworkDto {
  @ApiProperty({ type: [Edges] }) 
  edges: Edge[];
}

@ApiTags('Logistics')
@Controller()
export class AppController {    
  constructor(private readonly networkService: NetworkService) {}

  @Post('/network/upload')
  @ApiOperation({ summary: 'Subir definición del grafo' })
  upload(@Body() body: UploadNetworkDto) {
    const id = this.networkService.uploadNetwork(body.edges);
    return { id };
  }

  @Get('/network/nodes/:id')
  @ApiOperation({ summary: 'Obtener nodos de una red específica' })
  getNodes(@Param('id') id: string) {
    return this.networkService.getNodes(id);
  }

  @Post('/route/optimize/:id')
  @ApiOperation({ summary: 'Calcular ruta óptima con Dijkstra' })
  optimize(
    @Param('id') id: string,
    @Body() body: { originNodeId: string; destinationNodeId: string; preference?: any; constraints?: any }
  ) {
    const edges = this.networkService.getNetwork(id);
    
    const start = performance.now();
    const result = DijkstraEngine.calculate(
      edges,
      body.originNodeId,
      body.destinationNodeId,
      body.preference || 'shortest',
      body.constraints
    );
    const end = performance.now();

    if (!result || !result.path || result.path.length === 0 || result.path[0] !== body.originNodeId) {
      throw new BadRequestException('No existe una ruta entre los nodos seleccionados');
    }

    /** // Dentro de optimize()
const result = DijkstraEngine.calculate(edges, body.originNodeId, body.destinationNodeId, body.preference || 'shortest', body.constraints);

// Cambia la validación a esta:
if (!result || !result.path || result.path.length === 0 || result.path[0] !== body.originNodeId) {
  throw new BadRequestException('No existe una ruta entre los nodos seleccionados');
}
 */

    return {
      graphId: id,
      totalCost: result.totalCost,
      path: result.path,
      durationMs: parseFloat((end - start).toFixed(4))
    };
  }
}
