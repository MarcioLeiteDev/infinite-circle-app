import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './../auth/jwt-auth.guard'; // Se necessário
import { JwtModule } from '@nestjs/jwt'; // Importando JwtModule
import { MailModule } from './../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'mySecretKey', // Certifique-se de usar variáveis de ambiente em produção
      signOptions: { expiresIn: '1h' },
    }),
    MailModule
  ],

  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule { }
