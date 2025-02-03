import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: 'user' }) // Pode ser "admin", "user", "moderator", etc.
    role: string;

    @Column({ nullable: true })
    n1: number;

    @Column({ nullable: true })
    n2: number;

    @Column({ nullable: true })
    n3: number;

    @Column({ nullable: true })
    n4: number;

    @Column({ nullable: true })
    n5: number;

    @Column({ nullable: true })
    n6: number;

    @Column({ nullable: true })
    n7: number;

    @Column({ nullable: true })
    n8: number;

    @Column({ nullable: true })
    n9: number;

    @Column({ nullable: true })
    n10: number;

    @Column()
    password: string;
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
