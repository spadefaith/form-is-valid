

export default class Templating {
	static replace(obj, template) {
        return template.replace(/{{(.*?)}}/g, (match, key) => {
            return obj[key] !== undefined ? obj[key] : "";
        });
	}
}