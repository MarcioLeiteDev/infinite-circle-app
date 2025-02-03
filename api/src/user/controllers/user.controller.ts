import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            const result = await this.userService.createUser(createUserDto);
            return result;  // Aqui retorna a resposta de sucesso com status e mensagem
        } catch (error) {
            throw error;  // Propaga erro para ser tratado pelo NestJS
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            const result = await this.userService.updateUser(id, updateUserDto);
            return result;  // Retorna a resposta de sucesso com status e mensagem
        } catch (error) {
            throw error;  // Propaga erro para ser tratado pelo NestJS
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number) {
        try {
            await this.userService.deleteUser(id);
            return {
                statusCode: 200,
                message: `Usuário com ID ${id} deletado com sucesso!`,
            };
        } catch (error) {
            throw error;  // Propaga erro para ser tratado pelo NestJS
        }
    }
}
