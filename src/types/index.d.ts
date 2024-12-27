


export type HandlerArgsType = {
    name:string, 
    value:string}

export type ValidatorHandlerType = (HandlerArgsType) => boolean;

export type ValidatorType = {
    [key: string]:{
        handler:ValidatorHandlerType,
        error:string
    }
} 

export type ConfType = {
    parentClass:string;
    errorTextParent:string;
    errorTextTag:string;
    errorTextClass:string;
    errorClass:string;
    successClass:string;
    controlClass:string;
}

