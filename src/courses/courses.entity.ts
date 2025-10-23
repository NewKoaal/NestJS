import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Module } from './module.entity';

export enum Status {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index('idx_courses_title_tsearch')
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Index('idx_courses_instructor')
  @Column({ type: 'uuid' })
  instructorId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'instructorId' })
  instructor?: User;

  @Index('idx_courses_status')
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.DRAFT
  })
  status: string;

  @Column({ type: 'jsonb' })
  metadata: {
    duration: number;
    difficulty: Difficulty;
    prerequisites: string[];
    tags: string[];
    targetAudience: string;
  };

  @Column({ type: 'jsonb' })
  settings: {
    maxStudents: number;
    minStudents: number;
    teamSize: {
      min: number;
      max: number
    };
    discussionEnabled: boolean;
  };

  @Index()
  @Column()
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Module, (m) => m.course, { cascade: true })
  modules: Module[];
}
