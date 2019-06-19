const emailPattern = /.+@.+\..+/;
const telPattern = /^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/;
const numberPattern = /^[0-9]*$/;
const inputTypes = ['text', 'email', 'tel', 'number', 'color', 'date', 'url', 'select', 'select-one', 'radio', 'textarea'];
const Pattern = { 'email': emailPattern, 'tel': telPattern, 'number': numberPattern };

/* prototype for form */

Object.prototype.getElements = function () {
    let formElements = []
    try { formElements = this.elements; }
    catch (error) { throw error; }
    return formElements;
}

Object.prototype.getData = function () {
    let formElements = this.getElements();
    let formData = { valid: true, items: [], errors: [] }
    try {
        if (formElements.length > 0) {
            Array.from(formElements).map(element => {
                if (inputTypes.indexOf(element.type) > -1) {
                    formData.items[element.name] = element.value;
                    if (element.hasAttribute('required') && !element.isFilled()) {
                        formData.errors.push({ field: element.name, error: 'empty-field' });
                        formData.valid = false;
                    }
                    if (!element.isFilled()) {
                        formData.errors.push({ field: element.name, error: 'invalid-field' });
                        formData.valid = false;
                    }
                }
                if (element.type === 'checkbox')
                    formData.items[element.name] = element.checked;
            });
        }
    } catch (error) {
        throw error;
    }
    return formData;
}

Object.prototype.onSubmit = function () {
    let formData = this.getData();
    console.log(formData);
    if (!formData.valid) {
        var beforeAlert = document.querySelectorAll('[role="alert"][class="alert alert-danger"]')[0];
        if (!beforeAlert) {
            this.showAlert('danger', 'Form is invalid, Please fill all required field');
        }
        return false;
    }
    else {
        return true;
    }
}

var InitForm = () => {
    let allForms = document.forms;
    Array.from(allForms).map(form => {
        if (form.hasAttribute('validate')) {
            form.Validate();
        }
        form.querySelector('button[type="submit"]').addEventListener('click', (e) => {
            form.onSubmit();
            e.preventDefault();
        })
    });
}

Object.prototype.Validate = function () {
    let formElements = this.getElements();
    Array.from(formElements).map(element => {
        if (element.hasAttribute('required')) {
            element.addEventListener('blur', () => {
                element.isFilled();
            })
        }
        if (['tel', 'email', 'number'].indexOf(element.type) > 0 || element.hasAttribute('regex')) {
            element.addEventListener('blur', () => {
                element.isValid();
            })
        }
    })
}

Object.prototype.showAlert = function (type, message) {
    let elementID = GenerateID(12);
    let alert = document.createElement('div');
    alert.className = 'alert alert-' + type;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('id', elementID);
    alert.innerHTML = message;
    this.appendChild(alert);
    return elementID;
}

Object.prototype.removeAlert = function (alertID) {
    document.remove(alertID);
}

/* Prototype for fields */

Object.prototype.isFilled = function () {
    try {
        if (this.hasAttribute('required') && this.value === '') {
            this.addClass('error-empty');
            return false;
        }
        else {
            this.removeClass('error-empty');
            return true;
        }
    } catch (error) {
        return false;
    }
}

Object.prototype.isValid = function () {
    try {
        let regexPattern = Pattern[this.type];
        if (this.hasAttribute('regex')) {
            regexPattern = this.getAttribute('regex');
        }
        if (regexPattern !== '' && this.value != '') {
            if (!RegExp(regexPattern).test(this.value)) {
                this.addClass('error-invalid');
                return false;
            }
            else {
                this.removeClass('error-invalid');
                return true;
            }
        }
        else {
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

Object.prototype.addClass = function (className) {
    if (this.className.indexOf(className) < 0) {
        this.classList.add(className);
    }
}

Object.prototype.removeClass = function (className) {
    if (this.className.indexOf(className) > -1) {
        this.classList.remove(className)
    }
}

/* General functions */

const GenerateID = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

InitForm();