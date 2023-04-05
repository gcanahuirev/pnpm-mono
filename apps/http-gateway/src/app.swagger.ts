import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SMARTCORE API GATEWAY')
    // .addBearerAuth()
    .setDescription('Api Gateway for SmartCore Microservices')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v2/swagger', app, document, {
    swaggerOptions: {
      deepLinking: true,
      displayOperationId: true,
      defaultModelRendering: 'model',
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'obsidian',
      },
      tryItOutEnabled: false,
    },
  } as SwaggerCustomOptions);
};
