import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: 'http://localhost:3001', // Porta do seu frontend Next.js
    credentials: true // Permite envio de cookies e headers de autenticação
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
