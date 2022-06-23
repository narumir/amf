import {
    AMF0Marker,
    AMF0Type,
    AMF0DataType,
    AMF0_NORMAL_MAX_SIZE,
} from "./constants";

export class AMF0Serialize {
    private buffer = Buffer.alloc(0);
    private references: any[] = [];

    constructor(data: AMF0Type) {
        this.writeData(data);
    }

    public getResult() {
        return this.buffer;
    }

    private writeNumberMarker(data: number) {
        this.writeUInt8(AMF0DataType.NUMBER_MARKER);
        const buf = Buffer.alloc(8);
        buf.writeDoubleBE(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeBooleanMarker(data: boolean) {
        this.writeUInt8(AMF0DataType.BOOLEAN_MARKER);
        const buf = Buffer.alloc(1, 0);
        buf.writeUint8(data ? 1 : 0);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeStringMarker(data: string, withMarker: boolean = true) {
        if (withMarker) {
            this.writeUInt8(AMF0DataType.STRING_MARKER);
        }
        const buf = Buffer.from(data);
        this.writeUInt16(buf.length);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeObjectMarker(data: any) {
        this.writeUInt8(AMF0DataType.OBJECT_MARKER);
        for (let key in data) {
            this.writeStringMarker(key, false);
            this.writeData(data[key]);
        }
        this.writeStringMarker("", false);
        this.writeObjectEndMarker();
    }

    private writeNullMarker() {
        this.writeUInt8(AMF0DataType.NULL_MARKER);
    }

    private writeUndefinedMarker() {
        this.writeUInt8(AMF0DataType.UNDEFINED_MARKER);
    }

    private writeReferenceMarker(data: any) {
        this.writeUInt8(AMF0DataType.REFERENCE_MARKER);
        const idx = this.references.indexOf(data);
        if (idx === -1) {
            this.references.push(data);
        }
        if (idx > AMF0_NORMAL_MAX_SIZE) {
            throw new Error("Out of Reference range.");
        }
        this.writeUInt16(idx);
    }

    private writeECMAArrayMarker(data: any) {
        const idx = this.references.indexOf(data);
        if (idx >= 0) {
            this.writeReferenceMarker(data);
        }
        this.references.push(data);
        this.writeUInt8(AMF0DataType.ECMA_ARRAY_MARKER);
        this.writeUInt32(data.length);
        for (const key in data) {
            this.writeStringMarker(key, false);
            this.writeData(data[key]);
        }
        this.writeUInt16(0);
        this.writeUInt8(AMF0DataType.OBJECT_END_MARKER);
    }

    private writeObjectEndMarker() {
        this.writeUInt8(AMF0DataType.OBJECT_END_MARKER);
    }

    private writeStrictArrayMarker(data: any) {
        const idx = this.references.indexOf(data);
        if (idx >= 0) {
            this.writeReferenceMarker(data);
        }
        this.references.push(data);
        this.writeUInt8(AMF0DataType.STRICT_ARRAY_MARKER);
        this.writeUInt32(data.length);
        for (const key in data) {
            this.writeStringMarker(key, false);
            this.writeData(data[key]);
        }
        this.writeUInt16(0);
        this.writeUInt8(AMF0DataType.OBJECT_END_MARKER);
    }

    private writeDateMarker(data: Date) {
        this.writeUInt8(AMF0DataType.DATE_MARKER);
        this.writeNumberMarker(data.getTime());
        this.writeUInt16(0);
    }

    private writeLongStringMarker(data: string, withMarker: boolean = true) {
        if (withMarker) {
            this.writeUInt8(AMF0DataType.LONG_STRING_MARKER);
        }
        const buf = Buffer.from(data);
        this.writeUInt16(buf.length);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeUnsupportMarker() {
        this.writeUInt8(AMF0DataType.UNSUPPORT_MARKER);
    }

    private writeXMLDocumentMarker(data: string) {
        this.writeUInt8(AMF0DataType.XML_DOCUMENT_MARKER);
        this.writeLongStringMarker(data, false);
    }

    private writeTypedObjectMarker(data: any) {
        const idx = this.references.indexOf(data);
        if (idx >= 0) {
            this.writeReferenceMarker(data);
        }
        this.references.push(data);
        this.writeUInt8(AMF0DataType.TYPED_OBJECT_MARKER);
        this.writeStringMarker(data.constructor.name, false);
        for (const key in data) {
            this.writeStringMarker(key, false);
            this.writeData(data[key]);
        }
        this.writeUInt16(0);
        this.writeUInt8(AMF0DataType.OBJECT_END_MARKER);
    }

    private writeData(data: AMF0Type) {
        if (data == null) {
            throw new Error("Unknown data.");
        }
        if (data.marker == null) {
            return this.writeWithoutMarker(data);
        }
        switch (data.marker) {
            case AMF0Marker.NUMBER:
                if (typeof data.value !== "number") {
                    break;
                }
                return this.writeNumberMarker(data.value);
            case AMF0Marker.BOOLEAN:
                if (typeof data.value !== "boolean") {
                    break;
                }
                return this.writeBooleanMarker(data.value);
            case AMF0Marker.STRING:
                if (typeof data.value !== "string") {
                    break;
                }
                const str = data.value;
                return str.length > AMF0_NORMAL_MAX_SIZE
                    ? this.writeLongStringMarker(str)
                    : this.writeStringMarker(str);
            case AMF0Marker.OBJECT:
                if (!this.isObject(data.value)) {
                    break;
                }
                return this.writeObjectMarker(data.value);
            case AMF0Marker.NULL:
                return this.writeNullMarker();
            case AMF0Marker.UNDEFINED:
                return this.writeUndefinedMarker();
            case AMF0Marker.ECMA_ARRAY:
                return this.writeECMAArrayMarker(data.value);
            case AMF0Marker.STRICT_ARRAY:
                return this.writeStrictArrayMarker(data.value);
            case AMF0Marker.DATE:
                if ((data.value instanceof Date) === false) {
                    break;
                }
                return this.writeDateMarker(data.value);
            case AMF0Marker.XML_DOCUMENT:
                if (typeof data.value !== "string") {
                    break;
                }
                return this.writeXMLDocumentMarker(data.value);
            case AMF0Marker.TYPED_OBJECT:
                if (!this.isTypedObject(data.value)) {
                    break;
                }
                return this.writeTypedObjectMarker(data.value);
            case AMF0Marker.AVM_PLUS_OBJECT:
                // TODO
                return;
            default:
                break;
        }
        return this.writeUnsupportMarker();
    }

    private writeWithoutMarker(data: any) {
        if (data === null) {
            return this.writeNullMarker();
        }
        if (data === undefined) {
            return this.writeUndefinedMarker();
        }
        if (typeof data === "number") {
            return this.writeNumberMarker(data);
        }
        if (typeof data === "boolean") {
            return this.writeBooleanMarker(data);
        }
        if (typeof data === "string") {
            return data.length > AMF0_NORMAL_MAX_SIZE
                ? this.writeLongStringMarker(data)
                : this.writeStringMarker(data);
        }
        if (data instanceof Date) {
            return this.writeDateMarker(data)
        }
        if (Array.isArray(data)) {
            return this.isStrictArray(data)
                ? this.writeStrictArrayMarker(data)
                : this.writeECMAArrayMarker(data);
        }
        if (this.isObject(data)) {
            return this.writeObjectMarker(data);
        }
        if (this.isTypedObject(data)) {
            return this.writeTypedObjectMarker(data);
        }
        return this.writeUnsupportMarker();
    }

    private writeUInt8(data: number) {
        const buf = Buffer.alloc(1, 0);
        buf.writeUint8(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeUInt16(data: number) {
        const buf = Buffer.alloc(2, 0);
        buf.writeUint16BE(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeUInt32(data: number) {
        const buf = Buffer.alloc(4, 0);
        buf.writeUint32BE(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private isObject(data: any) {
        if (data == null) {
            return false;
        }
        if (typeof data !== "object") {
            return false;
        }
        if (data instanceof Date) {
            return false;
        }
        if (data.constructor.name !== "Object") {
            return false;
        }
        return true;
    }

    private isTypedObject(data: any) {
        if (data == null) {
            return false;
        }
        if (typeof data !== "object") {
            return false;
        }
        if (data instanceof Date) {
            return false;
        }
        if (data.constructor.name === "Object") {
            return false;
        }
        return true;
    }

    private isStrictArray(data: any[]) {
        let length = 0;
        for (const _ in data) {
            length += 1;
        }
        if (data.length !== length) {
            return false;
        }
        return true;
    }
}
