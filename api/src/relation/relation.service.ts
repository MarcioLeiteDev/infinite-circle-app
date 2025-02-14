import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Relation } from './relation.entity';
import { Relation } from './entities/relation.entity';

@Injectable()
export class RelationService {
    constructor(
        @InjectRepository(Relation)
        private relationRepository: Repository<Relation>,
    ) { }

    async createRelation(senderId: number, recipientId: number): Promise<Relation> {
        const relation = this.relationRepository.create({
            sender: { id: senderId },
            recipient: { id: recipientId },
        });

        return this.relationRepository.save(relation);
    }

    async getSentRelations(userId: number): Promise<Relation[]> {
        return this.relationRepository.find({
            where: { sender: { id: userId } },
            relations: ['recipient'],
        });
    }

    async getReceivedRelations(userId: number, recipientId: number): Promise<Relation[]> {
        return this.relationRepository.find({
            where: { recipient: { id: recipientId }, sender: { id: userId } },
            relations: ['sender', 'recipient'],
        });
    }
}

