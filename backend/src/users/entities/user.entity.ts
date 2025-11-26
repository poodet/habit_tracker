import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObjectDefinition } from '../../object-definitions/entities/object-definition.entity';
import { CalendarEvent } from '../../calendar-events/entities/calendar-event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(() => ObjectDefinition, (objectDefinition) => objectDefinition.user)
  objectDefinitions: ObjectDefinition[];

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.user)
  calendarEvents: CalendarEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
