

export default class Query{
    static all(element, selector):HTMLFormElement[] {
        return Array.from(element.querySelectorAll(selector));
    }

}