import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/create-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // Função para encontrar usuário por email
    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            console.error("Erro ao buscar usuário por email:", error);
            throw new InternalServerErrorException('Erro ao buscar usuário por email');
        }
    }

    // Função para criar um novo usuário
    async createUser(dto: CreateUserDto) {
        if (!dto.n1) {
            throw new BadRequestException("❌ Campo 'n1' está ausente ou vazio no payload!");
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(dto.password, salt);

            const existingUser = await this.userRepository.findOne({
                where: { id: dto.n1 },
            });

            let updatedPayload = { ...dto };

            if (existingUser) {
                // Move os valores para a próxima posição (n1 → n2, ..., n9 → n10)
                for (let i = 9; i >= 1; i--) {
                    const prevKey = `n${i}` as keyof User;
                    const nextKey = `n${i + 1}` as keyof User;

                    if (existingUser[prevKey] !== undefined && existingUser[prevKey] !== null) {
                        (updatedPayload as any)[nextKey] = existingUser[prevKey];
                    } else {
                        (updatedPayload as any)[nextKey] = null;
                    }
                }
                updatedPayload.n1 = dto.n1;
                updatedPayload.password = hashedPassword;

            }



            await this.userRepository.save(updatedPayload);

            return {
                statusCode: 201,
                message: 'Usuário criado com sucesso!',
                data: updatedPayload,
            };

        } catch (error) {
            console.error("Erro ao criar ou atualizar usuário:", error);
            throw new InternalServerErrorException('Erro ao criar ou atualizar o usuário');
        }
    }

    // Função para atualizar um usuário
    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.findOne(id);
            Object.assign(user, updateUserDto);

            if (updateUserDto.password) {
                user.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            const updatedUser = await this.userRepository.save(user);

            return {
                statusCode: 200,
                message: 'Usuário atualizado com sucesso!',
                data: updatedUser,
            };

        } catch (error) {
            console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
            throw new InternalServerErrorException('Erro ao atualizar o usuário');
        }
    }

    // Função para retornar todos os usuários
    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            console.error("Erro ao buscar todos os usuários:", error);
            throw new InternalServerErrorException('Erro ao buscar todos os usuários');
        }
    }

    // Função para buscar um usuário pelo ID
    async findOne(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
            }
            return user;
        } catch (error) {
            console.error(`Erro ao buscar usuário com ID ${id}:`, error);
            throw new InternalServerErrorException('Erro ao buscar o usuário');
        }
    }

    // Função para deletar um usuário
    async deleteUser(id: number): Promise<void> {
        try {
            const result = await this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
            }
        } catch (error) {
            console.error(`Erro ao deletar usuário com ID ${id}:`, error);
            throw new InternalServerErrorException('Erro ao deletar o usuário');
        }
    }
}
