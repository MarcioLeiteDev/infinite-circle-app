import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/create-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import { MailService } from './../../mail/mail.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService
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
            // const password = Math.random().toString(36).slice(-8); // Gera uma senha aleatória de 8 caracteres
            const password = dto.password // Gera uma senha aleatória de 8 caracteres
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await this.userRepository.findOne({
                where: { id: dto.n1 },
            });

            let updatedPayload = { ...dto };

            if (existingUser) {
                // // Move os valores para a próxima posição (n1 → n2, ..., n9 → n10)
                // for (let i = 9; i >= 1; i--) {
                //     const prevKey = `n${i}` as keyof User;
                //     const nextKey = `n${i + 1}` as keyof User;

                //     if (existingUser[prevKey] !== undefined && existingUser[prevKey] !== null) {
                //         (updatedPayload as any)[nextKey] = existingUser[prevKey];
                //     } else {
                //         (updatedPayload as any)[nextKey] = null;
                //     }
                // }
                updatedPayload.n1 = dto.n1;
                updatedPayload.password = hashedPassword;

            }

            await this.userRepository.save(updatedPayload);

            await this.mailService.sendWelcomeEmail(updatedPayload.email, updatedPayload.name, updatedPayload.password);

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
            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            // Verificar se o email já existe em outro usuário diferente do atual
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: updateUserDto.email },
                });

                if (existingUser && existingUser.id !== id) {
                    throw new ConflictException('Este email já está em uso');
                }
            }

            // Atualizar apenas os campos que foram enviados no DTO
            const updatedUser = await this.userRepository.update(id, {
                ...updateUserDto,
                password: updateUserDto.password
                    ? await bcrypt.hash(updateUserDto.password, 10)
                    : user.password,
            });

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


    async findAll(page: number = 1, limit: number = 10): Promise<{ data: User[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.userRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
        });

        return { data, total, page, limit };
    }

    async findAllByHierarchy(value: number): Promise<User[]> {
        try {
            // Busca usuários onde o parâmetro esteja em qualquer um dos campos n1 a n10
            const users = await this.userRepository.find({
                where: [
                    { n1: value },

                ]
            });

            if (!users || users.length === 0) {
                throw new NotFoundException(`Nenhum usuário encontrado com o valor ${value} na hierarquia.`);
            }

            return users;
        } catch (error) {
            console.error(`Erro ao buscar usuários na hierarquia com valor ${value}:`, error);
            throw new InternalServerErrorException('Erro ao buscar os usuários');
        }
    }

    async getUserHierarchy(userId: number, level = 10): Promise<User[]> {
        const hierarchy: User[] = [];

        let currentUser = await this.userRepository.findOne({
            where: { id: userId, active: true }
        });

        if (!currentUser) return [];

        let depth = 0;
        while (currentUser && currentUser.n1 !== null && depth < level) {
            const parent = await this.userRepository.findOne({
                where: { id: currentUser.n1, active: true }
            });

            if (!parent) break; // Se não encontrar mais ancestrais, para.

            hierarchy.unshift(parent); // Adiciona no início da lista para manter ordem ascendente.
            currentUser = parent;
            depth++;
        }

        return hierarchy;
    }

    async getUserHierarchyDesc(userId: number, level = 10): Promise<User[]> {
        const hierarchy: User[] = [];

        // Buscar o usuário inicial
        const user = await this.userRepository.findOne({
            where: { id: userId, active: true }
        });

        if (!user) return [];

        // Função recursiva para buscar os descendentes
        const fetchChildren = async (parentIds: number[], depth: number) => {
            if (depth > level || parentIds.length === 0) return;

            const children = await this.userRepository.find({
                where: { n1: In(parentIds), active: true }
            });

            if (children.length > 0) {
                hierarchy.push(...children); // Adiciona os filhos à hierarquia
                const nextParentIds = children.map(child => child.id);
                await fetchChildren(nextParentIds, depth + 1);
            }
        };

        // Começa a busca pelos filhos diretos do usuário
        await fetchChildren([userId], 1);

        return hierarchy;
    }






    async findAllByN1(n1: number): Promise<User[]> {
        try {
            // Busca todos os usuários onde o campo n1 é igual ao valor fornecido
            const users = await this.userRepository.find({ where: { n1 } });
            if (!users || users.length === 0) {
                throw new NotFoundException(`Nenhum usuário encontrado com n1 igual a ${n1}`);
            }
            return users;
        } catch (error) {
            console.error(`Erro ao buscar usuários com n1 igual a ${n1}:`, error);
            throw new InternalServerErrorException('Erro ao buscar os usuários');
        }
    }

    async findByN1(n1: number): Promise<User[]> {
        try {
            // Busca todos os usuários onde o campo n1 é igual ao valor fornecido
            const users = await this.userRepository.find({ where: { n1 } });
            if (!users || users.length === 0) {
                throw new NotFoundException(`Nenhum usuário encontrado com n1 igual a ${n1}`);
            }
            return users;
        } catch (error) {
            console.error(`Erro ao buscar usuários com n1 igual a ${n1}:`, error);
            throw new InternalServerErrorException('Erro ao buscar os usuários');
        }
    }

    // Função para buscar um usuário pelo ID
    async findOne(id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });

            if (!user) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
            }

            // Lista com os IDs de usuários relacionados
            const relatedIds = {
                n1: user.n1,

            };

            // Busca os usuários correspondentes aos IDs
            const relatedUsers = await Promise.all(
                Object.entries(relatedIds).map(async ([key, relatedId]) => {
                    if (relatedId !== null) {
                        const relatedUser = await this.userRepository.findOne({ where: { id: relatedId } });
                        return { key, data: relatedUser };
                    }
                    return { key, data: null };
                })
            );

            // Organiza os dados de volta no formato desejado
            const formattedUsers = relatedUsers.reduce((acc, { key, data }) => {
                acc[key] = data;
                return acc;
            }, {});

            return { ...user, ...formattedUsers };
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
