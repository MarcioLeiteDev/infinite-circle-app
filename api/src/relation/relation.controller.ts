import { Controller, Post, Get, Param } from '@nestjs/common';
import { RelationService } from './relation.service';

@Controller('relations')
export class RelationController {
    constructor(private readonly relationService: RelationService) { }

    @Post(':senderId/:recipientId')
    async createRelation(@Param('senderId') senderId: number, @Param('recipientId') recipientId: number) {
        return this.relationService.createRelation(senderId, recipientId);
    }

    @Get('sent/:userId')
    async getSentRelations(@Param('userId') userId: number) {
        return this.relationService.getSentRelations(userId);
    }

    @Get('received/:sendId/:recipientId')
    async getReceivedRelations(@Param('sendId') userId: number, @Param('recipientId') recipientId: number) {
        return this.relationService.getReceivedRelations(userId, recipientId);
    }
}
