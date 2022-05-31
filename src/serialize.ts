import {
    AMF0TypeMarker,
    AMF0_NORMAL_STRING_SIZE,
    AMFEncoding,
} from "./constants";

export class AMFSerialize {
    private buffer = Buffer.alloc(0);

    constructor(data: any, private encoding: AMFEncoding) {
        this.writeData(data);
    }

    public getResult() {
        return this.buffer;
    }

    private getAMF0Type(data: any) {
        if (data === null) {
            return AMF0TypeMarker.NULL_MARKER;
        }
        if (data === undefined) {
            return AMF0TypeMarker.UNDEFINED_MARKER;
        }
        if (typeof data === "number") {
            return AMF0TypeMarker.NUMBER_MARKER;
        }
        if (typeof data === "boolean") {
            return AMF0TypeMarker.NULL_MARKER;
        }
        if (typeof data === "string") {
            return data.length > AMF0_NORMAL_STRING_SIZE
                ? AMF0TypeMarker.LONG_STRING_MARKER
                : AMF0TypeMarker.STRING_MARKER;
        }
        if (typeof data === "object") {
            if (data instanceof Date) {
                return AMF0TypeMarker.DATE_MARKER;
            }
            return AMF0TypeMarker.OBJECT_MARKER;
        }
        return AMF0TypeMarker.UNSUPPORT_MARKER;
    }

    private getAMF3Type(data: any) {
        return 0;
    }

    private writeNumberMarker(data: number) {
        const buf = Buffer.alloc(8);
        buf.writeDoubleBE(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeBooleanMarker(data: boolean) {
        const buf = Buffer.alloc(1, 0);
        buf.writeUint8(data ? 1 : 0);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeStringMarker(data: string) {
        this.writeUint16(data.length);
        this.writeBuffer(data);
    }

    private writeObjectMarker(data: any) {
        for (let key in data) {
            this.writeStringMarker(key);
            this.writeData(data[key]);
        }
        this.writeStringMarker("");
        this.writeObjectEndMarker();
    }

    private writeObjectEndMarker() {
        this.writeUInt8(AMF0TypeMarker.OBJECT_END_MARKER);
    }

    private writeDateMarker(data: Date) {
        this.writeNumberMarker(data.getTime());
        this.writeUint16(0);
    }

    private writeLongStringMarker(data: string) {
        this.writeUint16(data.length);
        this.writeBuffer(data);
    }

    private writeData(data: any) {
        const type = this.encoding === AMFEncoding.AMF_0
            ? this.getAMF0Type(data)
            : this.getAMF3Type(data);
        if (this.encoding === AMFEncoding.AMF_0) {
            this.writeUInt8(type);
            switch (type) {
                case AMF0TypeMarker.NUMBER_MARKER:
                    return this.writeNumberMarker(data);
                case AMF0TypeMarker.BOOLEAN_MARKER:
                    return this.writeBooleanMarker(data);
                case AMF0TypeMarker.STRING_MARKER:
                    return this.writeStringMarker(data);
                case AMF0TypeMarker.OBJECT_MARKER:
                    return this.writeObjectMarker(data);
                case AMF0TypeMarker.MOVIECLIP_MARKER:
                    return;
                case AMF0TypeMarker.NULL_MARKER:
                    return;
                case AMF0TypeMarker.UNDEFINED_MARKER:
                    return;
                case AMF0TypeMarker.REFERENCE_MARKER:
                    // TODO
                    return;
                case AMF0TypeMarker.ECMA_ARRAY_MARKER:
                    // TODO
                    return;
                case AMF0TypeMarker.OBJECT_END_MARKER:
                    return this.writeObjectEndMarker();
                case AMF0TypeMarker.STRICT_ARRAY_MARKER:
                    // TODO
                    return;
                case AMF0TypeMarker.DATE_MARKER:
                    return this.writeDateMarker(data);
                case AMF0TypeMarker.LONG_STRING_MARKER:
                    return this.writeLongStringMarker(data);
                case AMF0TypeMarker.UNSUPPORT_MARKER:
                    return;
                case AMF0TypeMarker.RECOREDSET_MARKER:
                    return;
                case AMF0TypeMarker.XML_DOCUMENT_MARKER:
                    // TODO    
                    return;
                case AMF0TypeMarker.TYPED_OBJECT_MARKER:
                    // TODO
                    return;
                case AMF0TypeMarker.AVMPLUS_OBJECT_MARKER:
                    // TODO
                    return;
                default:
                    throw new Error("Unknown AMF0 type error.");
            }
        }
    }

    private writeUInt8(data: number) {
        const buf = Buffer.alloc(1, 0);
        buf.writeUint8(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeUint16(data: number) {
        const buf = Buffer.alloc(2, 0);
        buf.writeUint16BE(data);
        this.buffer = Buffer.concat([this.buffer, buf]);
    }

    private writeBuffer(data: WithImplicitCoercion<string | Uint8Array | number[]>) {
        const buf = Buffer.from(data);
        this.buffer = Buffer.concat([this.buffer, buf])
    }
}
