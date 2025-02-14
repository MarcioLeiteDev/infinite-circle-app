import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
// import { User } from '../user/user.entity';
import { User } from '../../user/entities/user.entity';

@Entity('relations')
export class Relation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentRelations)
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedRelations)
    recipient: User;

    @CreateDateColumn()
    sentAt: Date;
}
