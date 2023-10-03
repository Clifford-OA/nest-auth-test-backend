import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Test Endpoints')
    .setVersion('1.0')
    .addTag('Auth Test')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      filter: true,
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
