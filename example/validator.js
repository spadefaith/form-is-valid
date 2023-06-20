const Validator = {
  required: {
    handler(e) {
      let { value, target } = e;
      let test = !!value;

      return test;
    },
    error: 'This is required.',
  },
  min: {
    handler(e, param1) {
      // console.log(54, e, param1);
      let { value, target } = e;
      let test = value.length >= Number(param1);

      return test;
    },
    error: 'This should have minimum of {{0}} characters.',
  },
  max: {
    handler(e, param1) {
      let { value, target } = e;
      let test = value.length <= Number(param1);
      if (value.length - 1 == Number(param1)) {
        target.value = value.substring(0, value.length - 1);
        test = true;
      }

      return test;
    },
    error: 'This should have maximum of {{0}}.',
  },
  string: {
    handler(e) {
      // console.log(84, e);
      let { value, target } = e;

      let test =
        value.constructor &&
        value.constructor.name == 'String' &&
        isNaN(Number(value));

      return test;
    },
    error: 'This should be a text.',
  },
  'has-numeric': {
    handler(e) {
      let { value, target } = e;
      let split = value.split('');

      let test = split.some(item => !isNaN(Number(item)));

      return test;
    },
    error: 'This shoud have numeric character.',
  },
  'has-lowercase': {
    handler(e) {
      let { value, target } = e;
      let test = new RegExp(/[a-z]+/).test(value);

      return test;
    },
    error: 'This should have lowercase.',
  },
  'has-uppercase': {
    handler(e) {
      let { value, target } = e;
      let test = new RegExp(/[A-Z]+/).test(value);
      return test;
    },
    error: 'This should have uppercase.',
  },
  'has-special': {
    handler(e) {
      let { value, target } = e;
      let test = new RegExp(/\W+/).test(value);
      return test;
    },
    error: 'This should have special character.',
  },
  'has-space': {
    handler(e) {
      let { value, target } = e;
      let test = new RegExp(/^\S*$/).test(value);
      return test;
    },
    error: 'This should have no spaces.',
  },
  email: {
    handler(e) {
      let { value, target } = e;
      let test = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
      return test;
    },
    error: 'This should be a valid email.',
  },
  mobile: {
    handler(e) {
      let { value, target } = e;
      let hasPrefix = value.substring(0, 3) == '63-';
      let isLen = value.length == 13;
      return hasPrefix && isLen;
    },
    error: 'This should be a valid mobile number, example: 63-9260733225',
  },
  length: {
    handler(e, param1) {
      let { value, target } = e;
      let test = value.length == Number(param1);
      if (value.length - 1 == Number(param1)) {
        target.value = value.substring(0, value.length - 1);
        test = true;
      }

      return test;
    },
    error: 'This should have {{0}} characters.',
  },
};

export default Validator;
