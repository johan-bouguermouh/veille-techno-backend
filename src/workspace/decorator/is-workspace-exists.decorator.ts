import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { WorkspacesService } from '../workspaces.service';

@ValidatorConstraint({ async: true })
export class IsWorkspaceExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private workspaceService: WorkspacesService) {}

  async validate(value: any, args: ValidationArguments) {
    return this.workspaceService.doesWorkspaceExist(value);
  }

  defaultMessage() {
    return 'Workspace with this ID does not exist';
  }
}

export function IsWorkspaceExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const workspaceService = args.object['workspaceService'];
          const constraint = new IsWorkspaceExistsConstraint(workspaceService);
          return constraint.validate(value, args);
        },
        defaultMessage(args: ValidationArguments) {
          const constraint = new IsWorkspaceExistsConstraint(
            args.object['workspaceService'],
          );
          return constraint.defaultMessage();
        },
      },
    });
  };
}
