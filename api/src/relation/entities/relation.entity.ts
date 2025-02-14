import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
// import { User } from '../user/user.entity';
import { User } from '../../user/entities/user.entity';

@Entity('relations')
export class Relation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentRelations, { nullable: false, onDelete: 'CASCADE' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedRelations, { nullable: false, onDelete: 'CASCADE' })
    recipient: User;

    @CreateDateColumn()
    sentAt: Date;
}
