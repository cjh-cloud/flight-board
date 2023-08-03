import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    FlightModule
  ],
  controllers: [
    AppController,
    // AuthController
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }
    // AuthService
    // https://stackoverflow.com/questions/56870498/nest-cant-resolve-dependencies-of-the-itemsservice-please-make-sure-that-t
  ],
})
export class AppModule { }
