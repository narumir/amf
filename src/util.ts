export const createDynamicNameObject = (name: string) => {
    const Func = new Function(`return function ${name}() { }`)();
    return new Func();
};
