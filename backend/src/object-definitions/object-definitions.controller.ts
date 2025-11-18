import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectDefinitionsService } from './object-definitions.service';
import { CreateObjectDefinitionDto } from './dto/create-object-definition.dto';
import { UpdateObjectDefinitionDto } from './dto/update-object-definition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('object-definitions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('object-definitions')
export class ObjectDefinitionsController {
    constructor(private readonly objectDefinitionsService: ObjectDefinitionsService) { }

    @Post()
    create(@Request() req: any, @Body() createObjectDefinitionDto: CreateObjectDefinitionDto) {
        return this.objectDefinitionsService.create(req.user.userId, createObjectDefinitionDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.objectDefinitionsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.objectDefinitionsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateObjectDefinitionDto: UpdateObjectDefinitionDto,
    ) {
        return this.objectDefinitionsService.update(id, req.user.userId, updateObjectDefinitionDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.objectDefinitionsService.remove(id, req.user.userId);
    }
}
