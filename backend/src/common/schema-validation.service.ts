import { Injectable, BadRequestException } from '@nestjs/common';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

@Injectable()
export class SchemaValidationService {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false, // Allow additional properties for flexibility
    });
    addFormats(this.ajv); // Add support for formats like 'date', 'email', etc.
  }

  /**
   * Validates that the provided schema is a valid JSON Schema
   */
  validateSchema(schema: any): void {
    if (!schema || typeof schema !== 'object') {
      throw new BadRequestException('Schema must be a valid JSON object');
    }

    // Basic JSON Schema validation
    if (!schema.type) {
      throw new BadRequestException('Schema must have a "type" property');
    }

    if (schema.type === 'object' && !schema.properties) {
      throw new BadRequestException('Object type schema must have "properties"');
    }

    // Try to compile the schema to ensure it's valid
    try {
      this.ajv.compile(schema);
    } catch (error) {
      throw new BadRequestException(`Invalid JSON Schema: ${error.message}`);
    }
  }

  /**
   * Validates data against a JSON Schema
   */
  validateData(schema: any, data: any): void {
    let validate: ValidateFunction;

    try {
      validate = this.ajv.compile(schema);
    } catch (error) {
      throw new BadRequestException(`Invalid schema: ${error.message}`);
    }

    const valid = validate(data);

    if (!valid) {
      const errors = validate.errors
        ?.map((err) => {
          const path = err.instancePath || 'root';
          return `${path}: ${err.message}`;
        })
        .join(', ');

      throw new BadRequestException(`Data validation failed: ${errors}`);
    }
  }

  /**
   * Get detailed error messages for invalid data
   */
  getValidationErrors(schema: any, data: any): string[] {
    try {
      const validate = this.ajv.compile(schema);
      const valid = validate(data);

      if (!valid && validate.errors) {
        return validate.errors.map((err) => {
          const path = err.instancePath || 'root';
          return `${path}: ${err.message}`;
        });
      }

      return [];
    } catch (error) {
      return [`Schema compilation error: ${error.message}`];
    }
  }
}
