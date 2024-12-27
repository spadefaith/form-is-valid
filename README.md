# FormValidator

`FormValidator` is a simple form validation library that allows you to easily add validation rules to your form fields.

Form complete example check the code in test/index.html

## HTML Form

```html
<form name="form" id="form">
    <div class="group">
        <label>Username</label>
        <input data-validator="required" class="form-control" name="username" id="username" placeholder="username"/>
    </div>
    <div class="group">
        <label>Email</label>
        <input data-validator="required,email" class="form-control" name="email" id="email" placeholder="email"/>
    </div>
    <div>
        <button>Submit</button>
    </div>
</form>
```

## Instantiating FormValidator

```javascript
import FormValidator from "../dist/index.esm.js";

const validator = new FormValidator({
    parentClass: "group",
    errorClass: "invalid",
    successClass: "valid",
    errorTextParent: "group",
    errorTextTag: "div",
    errorTextClass: "invalid-feedback",
    controlClass: ".form-control",
});
```

## Setting Form

You can set which form to validate using setForm method

```javascript
validator.setForm(document.getElementById("form"));
```

## Setting Watcher

You can set a watcher function to be called whenever the validation status changes using the setWatcher method.

```javascript
validator.setWatcher((test)=>{console.log(35,"All is valid",test)});
```

## Adding Validation Rules

You can add custom validation rules using the addRule method. The addRule method takes three arguments:

- name: The name of the validation rule.
- handler: A function that takes an object with name and value properties and returns a boolean indicating whether the validation passed.
- error: The error message to display if the validation fails.

```javascript
validator.addRule("required", ({name, value}) => value.length > 3, "Value is required");
validator.addRule("email", ({name, value}) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value), "Value should be a valid email");
```

## Starting and Stopping Validation

To start validation, call the start method. To stop validation, call the stop method.

```javascript
validator.start();

document.getElementById("dispose").addEventListener("click", () => {
    validator.stop();
});
```
