import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService instance
  const configService = app.get(ConfigService);

  // Retrieve host and port from environment variables
  const host = configService.get<string>('HOST', '127.0.0.1'); // default fallback value
  const port = configService.get<number>('PORT', 3000); // default fallback value

  await app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
bootstrap();
