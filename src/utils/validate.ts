import { ValidatorType } from "../types";


export default class Validate {
    target:HTMLElement;
    value:string;
    callbacks:ValidatorType;
    successCallback:Function;
    errorCallback:Function;
    showErrorCallback:Function;
    constructor(
        target:HTMLFormElement,
        callbacks:ValidatorType,
        successCallback:Function,
        errorCallback:Function,
        showErrorCallback:Function){
        this.target = target || null;
        this.value = target?.value || null;
        this.callbacks = callbacks;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.showErrorCallback = showErrorCallback;
    }


	
}