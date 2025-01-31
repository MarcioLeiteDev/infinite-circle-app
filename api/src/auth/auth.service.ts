import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/services/user.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Credenciais inválidas');
    }

    async login(authDto: AuthDto) {
        const user = await this.validateUser(authDto.email, authDto.password);

        const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
