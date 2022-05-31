import {
    AMFEncoding,
    AMFSerialize,
} from "src";

test("Serialize AMF0 Object data with string and number", () => {
    const data = { name: 'Mike', age: 30, alias: 'Mike' };
    const serialize = new AMFSerialize(data, AMFEncoding.AMF_0);
    const result = serialize.getResult().toString("hex");
    expect(result)
        .toEqual("0300046e616d650200044d696b65000361676500403e0000000000000005616c6961730200044d696b65000009");
});
