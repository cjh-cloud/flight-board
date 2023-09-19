import { initTelemetry } from "./health/OpenTelemetry";
// ----- this has to come before imports! -------
initTelemetry({
  appName: process.env.OPEN_TELEMETRY_APP_NAME || "",
  telemetryUrl: process.env.OPEN_TELEMETRY_URL || "",
});
console.log("initialised telemetry");
// -------------

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Flight Board')
    .setDescription('The Flight Board API description')
    .setVersion('1.0')
    .addTag('flight_board')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
