import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './courses.entity';

export enum LessonType {
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    QUIZ = 'QUIZ',
    ASSIGNMENT = 'ASSIGNMENT',
}

export type Lesson = {
    id: string;
    title: string;
    type: LessonType;
    contentURL?: string;
    duration?: number;
    data?: Record<string, any>;
};

export type ModuleContent = {
    lessons: Lesson[];
};

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index('idx_course_modules_course_id')
  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Index()
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  orderIndex: number;

  @Column()
  estimatedDuration: number;

  @Column({ type: 'jsonb' })
  content: ModuleContent;

  @Column('text', { array: true, default: '{}' })
  prerequisites: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
