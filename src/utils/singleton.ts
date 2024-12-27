export default function singleton<T>(key, value?){
    if(!window[key]){
        window[key] = value;
    }
    return window[key] as T;    
}