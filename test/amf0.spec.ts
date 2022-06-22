import {
    AMF0Serialize,
    AMF0Deserialize,
    AMF0Marker,
    AMF0Type,
} from "src/index";

test("Serialize AMF0 number", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.NUMBER,
        value: 30,
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("00403e000000000000");
});

test("Deserialize data is 3.5(Number)", () => {
    const data = Buffer.from([0x00, 0x40, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual(3.5);
});

test("Serialize AMF0 boolean", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.BOOLEAN,
        value: true,
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("0101");
});

test("Deserialize data is true(Boolean)", () => {
    const data = Buffer.from([0x01, 0x01]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual(true);
});

test("Deserialize data is false(Boolean)", () => {
    const data = Buffer.from([0x01, 0x00]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual(false);
});

test("Serialize AMF0 string with korean", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.STRING,
        value: "hello world, 안녕 세상아",
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("02001d68656c6c6f20776f726c642c20ec9588eb859520ec84b8ec8381ec9584");
});

test("Deserialize data is 'this is a テスト'(String)", () => {
    const data = Buffer.from([0x02, 0x00, 0x13, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20,
        0xE3, 0x83, 0x86, 0xE3, 0x82, 0xB9, 0xE3, 0x83, 0x88]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual('this is a テスト');
});

test("Deserialize data is 'this is a 한글'(String)", () => {
    const data = Buffer.from([0x02, 0x00, 0x13, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0xED, 0x95, 0x9C, 0xEA, 0xB8, 0x80]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual('this is a 한글');
});

test("Serialize AMF0 Object with string and number", () => {
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
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("0300046e616d650200044d696b65000361676500403e0000000000000005616c6961730200044d696b65000009");
});

test("Deserialize AMF0 object with string and number", () => {
    const origin = { name: 'Mike', age: 30, alias: 'Mike' };
    const data = Buffer.from("0300046e616d650200044d696b65000361676500403e0000000000000005616c6961730200044d696b65000009", "hex");
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result)
        .toEqual(origin);
});

test("Serialize AMF0 NULL", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.NULL,
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("05");
});

test("Deserialize AMF0 NULL", () => {
    const data = Buffer.from("05", "hex");
    const deserialize = new AMF0Deserialize(data);
    expect(deserialize.readData())
        .toEqual(null);
});

test("Serialize AMF0 undefined", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.UNDEFINED,
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("06");
});

test("Deserialize AMF0 undefined", () => {
    const data = Buffer.from("06", "hex");
    const deserialize = new AMF0Deserialize(data);
    expect(deserialize.readData())
        .toEqual(undefined);
});

test("Serialize AMF0 date", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.DATE,
        value: new Date(2022, 5, 16, 0, 0, 0, 0),
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("0b004278167e0e1800000000");
});

test("Deserialize AMF0 date", () => {
    const data = Buffer.from("0b004278167e0e1800000000", "hex");
    const deserialize = new AMF0Deserialize(data);
    expect(deserialize.readData())
        .toEqual(new Date(2022, 5, 16, 0, 0, 0, 0));
});

class TestTypedObject {
    isWork: string = "It's Work!!!";
}

test("Serialize AMF0 typedobject", () => {
    const data: AMF0Type = {
        marker: AMF0Marker.TYPED_OBJECT,
        value: new TestTypedObject(),
    };
    const serialize = new AMF0Serialize(data);
    const result = serialize.getResult();
    expect(result.toString("hex"))
        .toEqual("10000f5465737454797065644f626a65637400066973576f726b02000c4974277320576f726b212121000009");
});

test("Deserialize AMF0 typedobject", () => {
    const data = Buffer.from("10000f5465737454797065644f626a65637400066973576f726b02000c4974277320576f726b212121000009", "hex");
    const deserialize = new AMF0Deserialize(data);
    expect(deserialize.readData())
        .toEqual({ __name: "TestTypedObject", isWork: "It's Work!!!" });
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
