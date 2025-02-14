import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './entities/relation.entity'
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Relation])],
  providers: [RelationService],
  controllers: [RelationController]
})
export class RelationModule { }
