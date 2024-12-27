declare module 'simple-form-valid/index' {
  import { ConfType, ValidatorHandlerType } from "simple-form-valid/types/index";
  import Validator, { ValidatorResult } from "simple-form-valid/utils/validator";
  export default class FormValidator {
      validator: Validator;
      _form: HTMLFormElement;
      parentClass: ConfType['parentClass'];
      errorTextParent: ConfType['errorTextParent'];
      errorTextTag: ConfType['errorTextTag'];
      errorTextClass: ConfType['errorTextClass'];
      errorClass: ConfType['errorClass'];
      successClass: ConfType['successClass'];
      controlClass: ConfType['controlClass'];
      timer: number;
      watcher: Function;
      constructor(opts: ConfType);
      addRule(name: string, handler: ValidatorHandlerType, error: string): void;
      setForm(form: any): void;
      setWatcher(callback: any): void;
      isLoading(): void;
      doneLoading(): void;
      addSuccessClass(target: any): void;
      addErrorClass(target: any): void;
      removeErrorClass(target: any): void;
      showError(target: any, validated: any): void;
      timelapse(callback: any): void;
      validate(selector: any, isNotify?: boolean): Promise<boolean>;
      _defaultValidateResult(data: any): ValidatorResult[];
      singleValidate(target: HTMLFormElement, isNotify: boolean): Promise<boolean>;
      _inputHandler(e: any): void;
      _inputCustomHandler(e: any): void;
      _addEvent(target: any): void;
      start(isInitialize: any): void;
      stop(): void;
      /**
       * Parses a validation string and returns an array of validation rules.
       *
       * @param str - The validation string to parse, formatted as key=value pairs separated by commas.
       *              Example: "required=true, min=3, max=10"
       * @returns An array of objects, each containing a `key` and a `value` property.
       *          If the value is a boolean string ("true" or "false"), it will be converted to a boolean.
       *          If the value contains multiple comma-separated values, it will be converted to an array.
       *          Otherwise, the value will be trimmed and returned as a string.
       */
      _parse(str: any): any;
  }
  export { Validator };

}
declare module 'simple-form-valid/utils/element' {
  export default class Query {
      static all(element: any, selector: any): HTMLFormElement[];
  }

}
declare module 'simple-form-valid/utils/singleton' {
  export default function singleton<T>(key: any, value?: any): T;

}
declare module 'simple-form-valid/utils/templating' {
  export default class Templating {
      static replace(obj: any, template: any): any;
  }

}
declare module 'simple-form-valid/utils/validator' {
  import { HandlerArgsType, ValidatorHandlerType } from "simple-form-valid/types/index";
  /**
   * A utility class for validating strings based on specified rules.
   */
  export class ValidatorResult {
      name: string;
      test: boolean;
      message: string | undefined;
      control: any;
      constructor(name: string, test: boolean, message: string | undefined, control: any);
  }
  export default class Validator {
      _validators: Map<string, {
          handler: ValidatorHandlerType;
          error: string;
      }>;
      constructor();
      add(name: string, handler: ValidatorHandlerType, error: string): void;
      one(name: string, obj: HandlerArgsType): ValidatorResult;
      all(obj: HandlerArgsType): ValidatorResult[];
      many(names: string[], obj: HandlerArgsType): ValidatorResult[];
  }

}
declare module 'simple-form-valid' {
  import main = require('simple-form-valid/src/index');
  export = main;
}