export enum AMF0DataType {
    NUMBER_MARKER = 0x00,
    BOOLEAN_MARKER = 0x01,
    STRING_MARKER = 0x02,
    OBJECT_MARKER = 0x03,
    MOVIECLIP_MARKER = 0x04, // 예약됨, 미지원
    NULL_MARKER = 0x05,
    UNDEFINED_MARKER = 0x06,
    REFERENCE_MARKER = 0x07,
    ECMA_ARRAY_MARKER = 0x08,
    OBJECT_END_MARKER = 0x09,
    STRICT_ARRAY_MARKER = 0x0a,
    DATE_MARKER = 0x0b,
    LONG_STRING_MARKER = 0x0c,
    UNSUPPORT_MARKER = 0x0d,
    RECOREDSET_MARKER = 0x0e, // 예약됨, 미지원
    XML_DOCUMENT_MARKER = 0x0F,
    TYPED_OBJECT_MARKER = 0x10,
    AVMPLUS_OBJECT_MARKER = 0x11,
}

export const AMF0_NORMAL_MAX_SIZE = 65536;

export enum AMF0Marker {
    NUMBER = "number",
    BOOLEAN = "boolean",
    STRING = "string",
    OBJECT = "object",
    NULL = "null",
    UNDEFINED = "undefined",
    ECMA_ARRAY = "ecma array",
    STRICT_ARRAY = "strict array",
    DATE = "date",
    XML_DOCUMENT = "xml document",
    TYPED_OBJECT = "typed object",
    AVM_PLUS_OBJECT = "avm plus object",
}

type AMF0Number = {
    marker: AMF0Marker.NUMBER;
    value: number;
}

type AMF0Boolean = {
    marker: AMF0Marker.BOOLEAN;
    value: boolean;
}

type AMF0String = {
    marker: AMF0Marker.STRING;
    value: string;
}

type AMF0Object = {
    marker: AMF0Marker.OBJECT;
    value: { [key: string]: AMF0Type };
}

type AMF0Null = {
    marker: AMF0Marker.NULL;
}

type AMF0Undefined = {
    marker: AMF0Marker.UNDEFINED;
}

type AMF0ECMAArray<T = any> = {
    marker: AMF0Marker.ECMA_ARRAY;
    value: T[];
}

type AMF0StrictArray<T = any> = {
    marker: AMF0Marker.STRICT_ARRAY;
    value: T[];
}

type AMF0Date = {
    marker: AMF0Marker.DATE;
    value: Date;
}

type AMF0XMLDocument = {
    marker: AMF0Marker.XML_DOCUMENT;
    value: string;
}

type AMF0TypedObject<T = any> = {
    marker: AMF0Marker.TYPED_OBJECT;
    value: T;
}

type AMF0AVMPlusObject = {
    marker: AMF0Marker.AVM_PLUS_OBJECT;
    value: any;
}

export type AMF0Type =
    AMF0Number |
    AMF0Boolean |
    AMF0String |
    AMF0Object |
    AMF0Null |
    AMF0Undefined |
    AMF0ECMAArray |
    AMF0StrictArray |
    AMF0Date |
    AMF0XMLDocument |
    AMF0TypedObject |
    AMF0AVMPlusObject;
