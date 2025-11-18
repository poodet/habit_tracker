import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectDefinition } from './entities/object-definition.entity';
import { CreateObjectDefinitionDto } from './dto/create-object-definition.dto';
import { UpdateObjectDefinitionDto } from './dto/update-object-definition.dto';

@Injectable()
export class ObjectDefinitionsService {
    constructor(
        @InjectRepository(ObjectDefinition)
        private objectDefinitionsRepository: Repository<ObjectDefinition>,
    ) { }

    async create(
        userId: string,
        createObjectDefinitionDto: CreateObjectDefinitionDto,
    ): Promise<ObjectDefinition> {
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
        Object.assign(objectDefinition, updateObjectDefinitionDto);
        return this.objectDefinitionsRepository.save(objectDefinition);
    }

    async remove(id: string, userId: string): Promise<void> {
        const objectDefinition = await this.findOne(id, userId);
        await this.objectDefinitionsRepository.remove(objectDefinition);
    }
}
