const inputEvent = function (callbacks) {
  return function (e) {
    if (e) {
      let target = e.target;
      let value = e.target.value;
      this.isLoading();
      validate(
        target,
        value,
        this.templating,
        callbacks,
        this.addSuccessClass.bind(this),
        this.addErrorClass.bind(this),
        this.showError.bind(this)
      );

      this.doneLoading();
    }
  };
};

class Templating {
  replaceString(obj, string) {
    let lefttag = '{{'.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    let righttag = '}}'.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let pattern = new RegExp(`${lefttag}${key}${righttag}`, 'g');
        pattern && (string = string.replace(pattern, `${obj[key]}`));
      }
    }
    return string;
  }
}

const Utils = {
  element: {
    querySelectorAllIncluded(form, controlSelector) {
      return [...form.querySelectorAll(controlSelector)];
    },
  },
};

const validate = function (
  target,
  value,
  templating,
  callbacks,
  successCallback,
  errorCallback,
  showErrorCallback
) {
  let attr = target.dataset.validator;
  let isRequired = false;

  if (!attr) {
    return;
  }
  let validator = attr.split(',').reduce((accu, iter) => {
    let [key, value] = iter.split('=');

    if (value && value.includes(',')) {
      value = value.split(',');
    } else {
      value = value ? value.trim() : true;
      if (value == 'true') {
        value = true;
      } else if (value == 'false') {
        value = false;
      }
    }

    if (key == 'required' && value == true) {
      isRequired = true;
    }

    accu.push({ key: key.trim(), value });

    return accu;
  }, []);
  if (!validator.length) {
    return;
  }
  const attrValues = {};
  let _callbacks = validator
    .filter(item => {
      return callbacks[item.key];
    })
    .map(item => {
      let { key, value } = item;
      attrValues[key] = value;

      let conf = callbacks[key];
      let callback = conf.handler;
      let errorMessage = conf.error;

      callback.errorMessage = errorMessage;
      callback.validatorName = key;

      return callback;
    });

  //skip the validation of not required and the value is empty
  if (!isRequired && target.value == '') {
    _callbacks = [];
  }

  const asy = async function (callbacks) {
    const validation = await Promise.all(
      callbacks.map(async callback => {
        let _attrValues = attrValues[callback.validatorName];

        let message = callback.errorMessage;

        if (_attrValues && message.includes('{') && message.includes('}')) {
          let data = _attrValues.split(',').reduce((accu, iter, index) => {
            accu[`${index}`] = iter;

            return accu;
          }, {});

          message = templating.replaceString(data, message);
        }
        let test = await callback(
          {
            target: target,
            value,
          },
          _attrValues
        );

        return { test, message };
      })
    );

    if (validation.some(val => !val.test)) {
      errorCallback(target);
    } else {
      successCallback(target);
    }
    showErrorCallback(target, validation);

    return validation;
  };
  return asy(_callbacks);
};

export default class FormValidator {
  constructor(form, validation, opts) {
    // type of element to create for the error text
    this.parentClass = opts.parentClass;
    this.errorTextParent = opts.errorTextParent;
    this.errorTextTag = opts.errorTextTag;
    // class of the error text element
    this.errorTextClass = opts.errorTextClass;
    //error class of the input
    this.errorClass = opts.errorClass;
    //success class of the input
    this.successClass = opts.successClass;
    //validation object
    this.validation = validation;
    this.form = form;

    this.templating = new Templating();

    this._addEvent(this.form);
  }

  _addEvent(target) {
    target.addEventListener('input', inputEvent(this.validation).bind(this));
  }
  isLoading() {
    // console.log('validating');
  }
  doneLoading() {
    // console.log('validated');
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
  showError(target, validated) {
    let hasError = false;
    const messages = validated.reduce((accu, item) => {
      let { test, message } = item;
      if (!test) {
        hasError = true;
        accu += `${message} <br>`;
      }

      return accu;
    }, '');
    // console.log(127,"error message", messages);

    // console.log(163,target, validated);

    // console.log(this.parentClass);

    let parentClass = `.${this.parentClass}`;

    let parent = target.closest(parentClass);
    // console.log(133, "parent",target,parentClass, parent);
    if (!parent) {
      throw new Error('parent is not found');
    }

    const errorTagIdentity = this.errorTextClass;
    const connectedErrorTextParent = parent.querySelector(
      `.${errorTagIdentity}`
    );
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
  async validate(controlSelector) {
    if (!this.form) {
      throw new Error('form is not found');
    }
    let controls = Utils.element.querySelectorAllIncluded(
      this.form,
      controlSelector
    );

    let val = await Promise.all(
      controls.map(control => {
        let value = control.value;
        return validate(
          control,
          value,
          this.templating,
          this.validation,
          this.addSuccessClass.bind(this),
          this.addErrorClass.bind(this),
          this.showError.bind(this)
        );
      })
    );

    return val
      .map(item => {
        if (item) {
          return item.every(item => {
            return item.test;
          });
        } else {
          return true;
        }
      })
      .every(item => {
        return item == true;
      });
  }
}
