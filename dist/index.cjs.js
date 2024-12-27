var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Validator: () => Validator,
  default: () => FormValidator
});
module.exports = __toCommonJS(src_exports);

// src/utils/element.ts
var Query = class {
  static all(element, selector) {
    return Array.from(element.querySelectorAll(selector));
  }
};

// src/utils/singleton.ts
function singleton(key, value) {
  if (!window[key]) {
    window[key] = value;
  }
  return window[key];
}

// src/utils/validator.ts
var ValidatorResult = class {
  name;
  test;
  message;
  control;
  constructor(name, test, message, control) {
    this.name = name;
    this.test = test;
    this.message = message;
    this.control = control;
  }
};
var Validator = class {
  _validators;
  constructor() {
    this._validators = /* @__PURE__ */ new Map();
  }
  add(name, handler, error) {
    this._validators.set(name, { handler, error });
  }
  one(name, obj) {
    const conf = this._validators.get(name);
    let test = false;
    if (conf?.handler) {
      test = conf.handler(obj);
    }
    return new ValidatorResult(name, test, conf?.error, {
      name: obj?.name,
      value: obj?.value
    });
  }
  all(obj) {
    return Array.from(this._validators.keys()).map((name) => {
      return this.one(name, obj);
    });
  }
  many(names, obj) {
    return names.map((name) => {
      return this.one(name, obj);
    });
  }
};

// src/index.ts
var FormValidator = class {
  validator;
  _form;
  parentClass;
  errorTextParent;
  errorTextTag;
  errorTextClass;
  errorClass;
  successClass;
  controlClass;
  timer;
  watcher;
  constructor(opts) {
    this.validator = new Validator();
    this.parentClass = opts.parentClass;
    this.errorTextParent = opts.errorTextParent;
    this.errorTextTag = opts.errorTextTag;
    this.errorTextClass = opts.errorTextClass;
    this.errorClass = opts.errorClass;
    this.successClass = opts.successClass;
    this.controlClass = opts.controlClass;
  }
  addRule(name, handler, error) {
    this.validator.add(name, handler, error);
  }
  setForm(form) {
    this._form = form;
  }
  setWatcher(callback) {
    this.watcher = callback.bind(this);
  }
  isLoading() {
  }
  doneLoading() {
  }
  addSuccessClass(target) {
    if (target.classList.contains(this.errorClass)) {
      target.classList.replace(this.errorClass, this.successClass);
    } else if (!target.classList.contains(this.successClass)) {
      target.classList.add(this.successClass);
    }
  }
  addErrorClass(target) {
    if (target.classList.contains(this.successClass)) {
      target.classList.replace(this.successClass, this.errorClass);
    } else if (!target.classList.contains(this.errorClass)) {
      target.classList.add(this.errorClass);
    }
  }
  removeErrorClass(target) {
    const group = target.closest(`.${this.parentClass}`);
    if (group) {
      const errorTagIdentity = this.errorTextClass;
      const connectedErrorTextParent = group.querySelector(`.${errorTagIdentity}`);
      if (connectedErrorTextParent) {
        connectedErrorTextParent.remove();
      }
    }
    if (target.classList.contains(this.errorClass)) {
      target.classList.remove(this.errorClass);
    }
  }
  showError(target, validated) {
    let hasError = false;
    const messages = validated.reduce((accu, item) => {
      let { test, message } = item;
      if (!test) {
        hasError = true;
        accu += `${message} <br>`;
      }
      return accu;
    }, "");
    let parentClass = `.${this.parentClass}`;
    let parent = target.closest(parentClass);
    if (!parent) {
      throw new Error("parent is not found");
    }
    const errorTagIdentity = this.errorTextClass;
    const connectedErrorTextParent = parent.querySelector(`.${errorTagIdentity}`);
    if (connectedErrorTextParent) {
      connectedErrorTextParent.remove();
    }
    if (hasError) {
      let tag = document.createElement(this.errorTextTag);
      tag.classList.add(errorTagIdentity);
      tag.innerHTML = messages;
      parent.appendChild(tag);
    }
  }
  timelapse(callback) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      callback();
    }, 500);
  }
  async validate(selector, isNotify = true) {
    if (!this._form) throw new Error("form is not found");
    const controls = Query.all(this._form, selector || this.controlClass);
    const validated = controls.map((control) => {
      return this.singleValidate(control, isNotify);
    });
    const allTest = (await Promise.all(validated)).every((item) => item);
    if (this.watcher) {
      this.watcher(allTest);
    }
    return allTest;
  }
  _defaultValidateResult(data) {
    return [new ValidatorResult("default", true, "", { name: data?.name, value: data?.value })];
  }
  async singleValidate(target, isNotify) {
    const d = { name: target.name, value: target.value };
    const constraints = target.getAttribute("data-validator") || target.dataset.validator;
    let validation = null;
    if (!constraints) {
      validation = this._defaultValidateResult(d);
    } else {
      validation = this.validator.many(this._parse(constraints).map((item) => item.key), d);
    }
    const hasError = validation.some((item) => !item.test);
    if (isNotify) {
      if (hasError) {
        this.addErrorClass(target);
      } else {
        this.addSuccessClass(target);
      }
      this.showError(target, validation);
    }
    return !hasError;
  }
  _inputHandler(e) {
    if (e.target.dataset.noValidate) return console.log("noValidate is set to true");
    this.singleValidate(e.target, true);
    this.validate(null, false);
  }
  _inputCustomHandler(e) {
    const target = e.detail.target;
    if (!target) return console.log("target is required for custom event x-input");
    if (target.dataset.noValidate) return console.log("noValidate is set to true");
    this.singleValidate(target, true);
    this.validate(null, false);
  }
  _addEvent(target) {
    singleton("_inputHandler", this._inputHandler.bind(this));
    singleton("_inputCustomHandler", this._inputCustomHandler.bind(this));
    target.addEventListener("input", singleton("_inputHandler"));
    target.addEventListener("x-input", singleton("_inputCustomHandler"));
  }
  start(isInitialize) {
    if (isInitialize == true) {
      this.validate(null, true);
    }
    this._addEvent(this._form);
  }
  stop() {
    this._form.removeEventListener("input", singleton("_inputHandler"));
    this._form.removeEventListener("x-input", singleton("_inputCustomHandler"));
  }
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
  _parse(str) {
    return str.split(",").reduce((accu, iter) => {
      let [key, value] = iter.split("=");
      value = value ? value.trim() : true;
      if (value == "true") {
        value = true;
      } else if (value == "false") {
        value = false;
      }
      accu.push({ key: key.trim(), value });
      return accu;
    }, []);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validator
});
