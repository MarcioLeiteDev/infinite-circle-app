import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';

@Controller('user') // Prefixo da rota: /user
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
            return result;
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
        return this.userService.findAll(Number(page), Number(limit));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get(':id/hierarchy')
    async getUserHierarchy(@Param('id') id: number) {
        return this.userService.getUserHierarchy(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-n1/:n1')
    async getUsersByN1(@Param('n1') n1: number) {
        return this.userService.findByN1(n1);
    }

    @UseGuards(JwtAuthGuard)
    @Get('all/:n1')
    async getUsersAll(@Param('n1') n1: number) {
        return this.userService.findAllByHierarchy(n1);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            const result = await this.userService.updateUser(id, updateUserDto);
            return result;
        } catch (error) {
            throw error;
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
            throw error;
        }
    }
}