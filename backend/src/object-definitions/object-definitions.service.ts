import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectDefinition } from './entities/object-definition.entity';
import { CreateObjectDefinitionDto } from './dto/create-object-definition.dto';
import { UpdateObjectDefinitionDto } from './dto/update-object-definition.dto';
import { SchemaValidationService } from '../common/schema-validation.service';

@Injectable()
export class ObjectDefinitionsService {
    constructor(
        @InjectRepository(ObjectDefinition)
        private objectDefinitionsRepository: Repository<ObjectDefinition>,
        private schemaValidationService: SchemaValidationService,
    ) { }

    async create(
        userId: string,
        createObjectDefinitionDto: CreateObjectDefinitionDto,
    ): Promise<ObjectDefinition> {
        // Validate that the schema is a valid JSON Schema
        this.schemaValidationService.validateSchema(createObjectDefinitionDto.schema);

        const objectDefinition = this.objectDefinitionsRepository.create({
            ...createObjectDefinitionDto,
            userId,
        });
        return this.objectDefinitionsRepository.save(objectDefinition);
    }

    async findAll(userId: string): Promise<ObjectDefinition[]> {
        return this.objectDefinitionsRepository.find({ where: { userId } });
    }

    async findOne(id: string, userId: string): Promise<ObjectDefinition> {
        const objectDefinition = await this.objectDefinitionsRepository.findOne({
            where: { id, userId },
        });
        if (!objectDefinition) {
            throw new NotFoundException(`Object definition with ID ${id} not found`);
        }
        return objectDefinition;
    }

    async update(
        id: string,
        userId: string,
        updateObjectDefinitionDto: UpdateObjectDefinitionDto,
    ): Promise<ObjectDefinition> {
        const objectDefinition = await this.findOne(id, userId);

        // If updating schema, validate it
        if (updateObjectDefinitionDto.schema) {
            this.schemaValidationService.validateSchema(updateObjectDefinitionDto.schema);
        }

        Object.assign(objectDefinition, updateObjectDefinitionDto);
        return this.objectDefinitionsRepository.save(objectDefinition);
    }

    async remove(id: string, userId: string): Promise<void> {
        const objectDefinition = await this.findOne(id, userId);
        await this.objectDefinitionsRepository.remove(objectDefinition);
    }
}
