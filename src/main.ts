import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api', { exclude: [''] });
  const port = process.env.PORT || 3000;
  app.listen(port).then(() => {
    console.log(`Server listen request on port: ${port}`);
  });
}
bootstrap();
