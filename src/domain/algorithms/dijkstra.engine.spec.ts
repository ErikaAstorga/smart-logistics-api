import { ApiProperty } from '@nestjs/swagger';

export class Edges { 
  @ApiProperty({ example: 'A' })
  from: string;

  @ApiProperty({ example: 'B' })
  to: string;

  @ApiProperty({ example: 10 })
  cost: number;

  @ApiProperty({ example: 5, required: false })
  time?: number;

  @ApiProperty({ example: 'highway', required: false })
  type?: 'highway' | 'local';
}
