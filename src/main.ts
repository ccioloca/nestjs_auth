import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ExceptionLoggerFilter } from "./exceptionLogger.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalFilters(new ExceptionLoggerFilter());
  await app.init();
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get("APP_PORT");
  await app.listen(port);
  console.log("SERVER STARTED ON PORT: ", port);
}
bootstrap();
