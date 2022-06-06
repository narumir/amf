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
