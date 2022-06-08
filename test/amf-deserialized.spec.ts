import {
    AMF0Deserialize
} from "src";

test("Deserialize data is 3.5(Number)", () => {
    const data = Buffer.from([0x00, 0x40, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const deserialize = new AMF0Deserialize(data);
    const result = deserialize.readData();
    expect(result).toEqual(3.5);
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


