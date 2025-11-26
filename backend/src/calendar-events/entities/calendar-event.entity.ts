import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ObjectDefinition } from '../../object-definitions/entities/object-definition.entity';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  allDay: boolean;

  @Column({ type: 'jsonb' })
  data: Record<string, any>; // Custom data based on object definition schema

  @ManyToOne(() => User, (user) => user.calendarEvents, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => ObjectDefinition, (objectDefinition) => objectDefinition.events, {
    onDelete: 'CASCADE',
  })
  objectDefinition: ObjectDefinition;

  @Column()
  objectDefinitionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
