export function serialize( obj ) {
    let str = '?' + Object.keys(obj).reduce(function(a, k){
        a.push(k + '=' + encodeURIComponent(obj[k]));
        return a;
    }, []).join('&');
    return str;
}

export const verifyIntegerInput = (e) => {
  if (e.target.valueAsNumber < 0 || !Number.isInteger(e.target.valueAsNumber)) e.target.value = Math.ceil(e.target.valueAsNumber);
}
