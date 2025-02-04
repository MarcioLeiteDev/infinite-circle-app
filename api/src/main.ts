import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Permite requisições do frontend Next.js
    credentials: true, // Permite envio de cookies/tokens
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite headers específicos
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
