import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ObjectDefinitionsModule } from './object-definitions/object-definitions.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { User } from './users/entities/user.entity';
import { ObjectDefinition } from './object-definitions/entities/object-definition.entity';
import { CalendarEvent } from './calendar-events/entities/calendar-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, ObjectDefinition, CalendarEvent],
        synchronize: configService.get('NODE_ENV') === 'development', // Only in dev!
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ObjectDefinitionsModule,
    CalendarEventsModule,
  ],
})
export class AppModule {}
