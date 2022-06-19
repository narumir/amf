import {
    AMF0DataType,
} from "./constants";

export class AMF0Deserialize {
    private cursor: number = 0;
    private references: any[] = [];

    constructor(private data: Buffer) { }

    public readData() {
        const type = this.readUInt8();
        switch (type) {
            case AMF0DataType.NUMBER_MARKER:
                return this.readNumberMarker();
            case AMF0DataType.BOOLEAN_MARKER:
                return this.readBooleanMarker();
            case AMF0DataType.STRING_MARKER:
                return this.readStringMarker();
            case AMF0DataType.OBJECT_MARKER:
                return this.readObjectMarker();
            case AMF0DataType.MOVIECLIP_MARKER:
                throw new Error("Sorry. this type not support, reserved for future.");
            case AMF0DataType.NULL_MARKER:
                return null;
            case AMF0DataType.UNDEFINED_MARKER:
                return undefined;
            case AMF0DataType.REFERENCE_MARKER:
                return this.readReferenceMarker();
            case AMF0DataType.ECMA_ARRAY_MARKER:
                return this.readECMAArrayMarker();
            case AMF0DataType.OBJECT_END_MARKER:
                return type;
            case AMF0DataType.STRICT_ARRAY_MARKER:
                return this.readStrictArrayMarker();
            case AMF0DataType.DATE_MARKER:
                return this.readDateMarker();
            case AMF0DataType.LONG_STRING_MARKER:
                return this.readLongStringMarker();
            case AMF0DataType.UNSUPPORT_MARKER:
                return;
            case AMF0DataType.RECOREDSET_MARKER:
                throw new Error("Sorry. this type not support, reserved for future.");
            case AMF0DataType.XML_DOCUMENT_MARKER:
                return this.readXMLDocumentMarker();
            case AMF0DataType.TYPED_OBJECT_MARKER:
                return this.readTypedObjectMarker();
            case AMF0DataType.AVMPLUS_OBJECT_MARKER:

            default:
                throw new Error("Unknown AMF0 type error.");
        }
    }

    private readNumberMarker() {
        const buf = this.data.readDoubleBE(this.cursor);
        this.cursor += 8;
        return buf;
    }

    private readBooleanMarker() {
        const buf = this.readUInt8();
        return buf === 0 ? false : true;
    }

    private readStringMarker() {
        const len = this.readUInt16();
        const str = this.data.toString("utf8", this.cursor, this.cursor + len);
        this.cursor += len;
        return str;
    }

    private readObjectMarker() {
        const ref: any = {};
        while (true) {
            const key = this.readStringMarker();
            const value = this.readData();
            if (value === AMF0DataType.OBJECT_END_MARKER) {
                break;
            }
            ref[key] = value;
        }
        return ref;
    }

    private readReferenceMarker() {
        const idx = this.readUInt16();
        const value = this.references[idx];
        if (value == null) {
            throw new Error("Reference value not found.");
        }
        return value;
    }

    private readECMAArrayMarker() {
        this.readUint32();
        return this.readObjectMarker();
    }

    private readStrictArrayMarker() {
        const arr: any[] = [];
        for (let len = this.readUint32(); len; len--) {
            const key = this.readStringMarker();
            const val = this.readData();
            arr.push(val);
        }
        return arr;
    }

    private readDateMarker() {
        this.readUInt8();
        const time = this.readNumberMarker();
        this.readUInt16();
        return new Date(time);
    }

    private readLongStringMarker() {
        const len = this.readUInt16();
        const str = this.data.toString("utf-8", this.cursor, this.cursor + len);
        this.cursor += len;
        return str;
    }

    private readTypedObjectMarker() {
        const name = this.readStringMarker();
        const obj: Record<string, any> = { __name: name };
        Object.assign(obj, this.readObjectMarker());
        return obj;
    }

    private readXMLDocumentMarker() {
        return this.readLongStringMarker();
    }

    private readUInt8() {
        const buf = this.data.readUint8(this.cursor);
        this.cursor += 1;
        return buf;
    }

    private readUInt16() {
        const buf = this.data.readUint16BE(this.cursor);
        this.cursor += 2;
        return buf;
    }

    private readUint32() {
        const buf = this.data.readUint32BE(this.cursor);
        this.cursor += 4;
        return buf;
    }
}
