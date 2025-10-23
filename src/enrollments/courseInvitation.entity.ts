import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';

export enum InvitationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    EXPIRED = 'EXPIRED',
}

@Entity('course_invitations')
export class CourseInvitation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({ type: 'uuid' })
  invitedBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invitedBy' })
  user?: User;

  @Column()
  inviteeEmail: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING
  })
  status: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}