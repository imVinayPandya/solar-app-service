import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApplicationRepository } from '../../applications/domain/repositories/application.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueApplicationNameConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject('APPLICATIONS_REPOSITORY')
    private readonly repository: ApplicationRepository,
  ) {}

  async validate(name: string): Promise<boolean> {
    const exists = await this.repository.findByName(name);
    return !exists;
  }

  defaultMessage(): string {
    return 'Application with this name already exists';
  }
}

export function IsUniqueApplicationName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueApplicationNameConstraint,
    });
  };
}
