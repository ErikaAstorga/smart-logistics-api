import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NetworkService } from './network/network.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [NetworkService], // Registramos el servicio aquí
})
export class AppModule {}
