import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT

  const config = new DocumentBuilder()
    .setTitle('Teddy API')
    .setDescription('Api to reduce url')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(PORT, () => {
    console.log(`Servidor rodando na url:http://localhost:${PORT}`)
  });


}

bootstrap();
