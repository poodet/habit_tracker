import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectDefinitionsService } from './object-definitions.service';
import { ObjectDefinitionsController } from './object-definitions.controller';
import { ObjectDefinition } from './entities/object-definition.entity';
import { SchemaValidationService } from '../common/schema-validation.service';

@Module({
    imports: [TypeOrmModule.forFeature([ObjectDefinition])],
    controllers: [ObjectDefinitionsController],
    providers: [ObjectDefinitionsService, SchemaValidationService],
    exports: [ObjectDefinitionsService],
})
export class ObjectDefinitionsModule { }
