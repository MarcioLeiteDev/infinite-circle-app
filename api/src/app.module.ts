import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';
import { RelationModule } from './relation/relation.module';
import { Relation } from './relation/entities/relation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Altere para seu usuário do MySQL
      password: '', // Altere para sua senha
      database: 'api_nest', // Nome do banco de dados
      entities: [User, Relation], // Inclui as entidades do banco
      synchronize: true, // Cria as tabelas automaticamente (use só em dev) Somente para desenvolvimento
    }),
    TypeOrmModule.forFeature([User, RelationModule]), // Certifique-se de que também está aqui
    UserModule,
    AuthModule,
    MailModule,
    RelationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
