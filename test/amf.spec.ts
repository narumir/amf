import {
    AMF0Marker,
    AMF0Type,
    AMF0Serialize,
    AMF0Deserialize,
} from "src";

test("Serialize AMF0 Object data with string and number", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.OBJECT,
        value: {
            name: {
                marker: AMF0Marker.STRING,
                value: "Mike",
            },
            age: {
                marker: AMF0Marker.NUMBER,
                value: 30,
            },
            alias: {
                marker: AMF0Marker.STRING,
                value: "Mike",
            },
        },
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize
        .getResult()
        .toString("hex");
    expect(result)
        .toEqual("0300046e616d650200044d696b65000361676500403e0000000000000005616c6961730200044d696b65000009");
});

test("Function is unsupport", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.STRING,
        value: function () { } as any,
    }
    const serialize = new AMF0Serialize(data);
    const result = serialize
        .getResult()
        .toString("hex");
    expect(result)
        .toEqual("0d");
});

test("Serialize and Deserialize Date", () => {
    const now = new Date();
    const data: AMF0Type = {
        marker: AMF0Marker.DATE,
        value: now,
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    const deserialize = new AMF0Deserialize(result);
    expect(deserialize.readData())
        .toEqual(now);
});

test("Deserialize data", () => {
    const origin = { name: 'Mike', age: 30, alias: 'Mike' };
    const data = Buffer.from("0300046e616d650200044d696b65000361676500403e0000000000000005616c6961730200044d696b65000009", "hex");
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result)
        .toEqual(origin);
});
