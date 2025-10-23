import { Entity, Column, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum UserRole {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN',
}

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT
  })
  role: UserRole;

  @Column({ type: 'jsonb', nullable: true })
  profileData: { 
    metadata?: any 
  };

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
