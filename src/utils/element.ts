

export default class Query{
    static all(element, selector):HTMLFormElement[] {
        return Array.from(element.querySelectorAll(selector));
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
    static parseValidationAttr(str){
        return str.split(',').reduce((accu, iter) => {
            let [key, value] = iter.split('=');
    
            value = value ? value.trim() : true;
            if (value == 'true') {
                value = true;
            } else if (value == 'false') {
                value = false;
            }

            accu.push({ key: key.trim(), value:value });
            return accu;
        }, [])
    }
}