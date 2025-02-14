import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { Relation } from '../relation/relation.entity';
import { Relation } from '../../relation/entities/relation.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column()
    type: string;

    @Column()
    key: string;

    @Column()
    phone: string;

    @Column({ default: 'user' }) // Pode ser "admin", "user", "moderator", etc.
    role: string;

    @Column({ nullable: true })
    n1: number;

    @Column({ default: true })
    active: boolean;

    @ManyToOne(() => User, (user) => user.children, { nullable: true })
    parent: User;

    @OneToMany(() => User, (user) => user.parent)
    children: User[];

    @OneToMany(() => Relation, (relation) => relation.sender)
    sentRelations: Relation[];

    @OneToMany(() => Relation, (relation) => relation.recipient)
    receivedRelations: Relation[];


}
