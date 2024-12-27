import { HandlerArgsType, ValidatorHandlerType } from "../types";

/**
 * A utility class for validating strings based on specified rules.
 */



export class ValidatorResult {
    name:string;
    test:boolean;
    message:string | undefined;
    control:any;
    constructor(name:string, test:boolean, message:string | undefined, control:any){
        this.name = name;
        this.test = test;
        this.message = message;
        this.control = control;
    }
}

export default class Validator {
    _validators:Map<string, { handler:ValidatorHandlerType, error:string }>;
    constructor(){
        this._validators = new Map;
    }

    add(name:string, handler:ValidatorHandlerType, error:string){
        this._validators.set(name, { handler, error });
    }

    one(name:string, obj:HandlerArgsType): ValidatorResult{
        const conf = this._validators.get(name);
        let test = false;
        if(conf?.handler){
            test = conf.handler(obj);
        }

        return new ValidatorResult(name, test, conf?.error, {
            name:obj?.name,
            value:obj?.value,
        });
    }

    all(obj:HandlerArgsType){
        return Array.from(this._validators.keys()).map(name => {
            return this.one(name, obj);
        });
    }

    many(names:string[], obj:HandlerArgsType):ValidatorResult[]{
        return names.map(name => {
            return this.one(name, obj);
        });
    }
}