let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_4.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(
state => {
    wasm.__wbindgen_export_5.get(state.dtor)(state.a, state.b);
}
);

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_5.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_4.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_4.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Read a Parquet file into Arrow data.
 *
 * This returns an Arrow table in WebAssembly memory. To transfer the Arrow table to JavaScript
 * memory you have two options:
 *
 * - (Easier): Call {@linkcode Table.intoIPCStream} to construct a buffer that can be parsed with
 *   Arrow JS's `tableFromIPC` function.
 * - (More performant but bleeding edge): Call {@linkcode Table.intoFFI} to construct a data
 *   representation that can be parsed zero-copy from WebAssembly with
 *   [arrow-js-ffi](https://github.com/kylebarron/arrow-js-ffi) using `parseTable`.
 *
 * Example with IPC stream:
 *
 * ```js
 * import { tableFromIPC } from "apache-arrow";
 * import initWasm, {readParquet} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * const resp = await fetch("https://example.com/file.parquet");
 * const parquetUint8Array = new Uint8Array(await resp.arrayBuffer());
 * const arrowWasmTable = readParquet(parquetUint8Array);
 * const arrowTable = tableFromIPC(arrowWasmTable.intoIPCStream());
 * ```
 *
 * Example with `arrow-js-ffi`:
 *
 * ```js
 * import { parseTable } from "arrow-js-ffi";
 * import initWasm, {readParquet, wasmMemory} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 * const WASM_MEMORY = wasmMemory();
 *
 * const resp = await fetch("https://example.com/file.parquet");
 * const parquetUint8Array = new Uint8Array(await resp.arrayBuffer());
 * const arrowWasmTable = readParquet(parquetUint8Array);
 * const ffiTable = arrowWasmTable.intoFFI();
 * const arrowTable = parseTable(
 *   WASM_MEMORY.buffer,
 *   ffiTable.arrayAddrs(),
 *   ffiTable.schemaAddr()
 * );
 * ```
 *
 * @param parquet_file Uint8Array containing Parquet data
 * @param options
 *
 *    Options for reading Parquet data. Optional keys include:
 *
 *    - `batchSize`: The number of rows in each batch. If not provided, the upstream parquet
 *           default is 1024.
 *    - `rowGroups`: Only read data from the provided row group indexes.
 *    - `limit`: Provide a limit to the number of rows to be read.
 *    - `offset`: Provide an offset to skip over the given number of rows.
 *    - `columns`: The column names from the file to read.
 * @param {Uint8Array} parquet_file
 * @param {ReaderOptions | null} [options]
 * @returns {Table}
 */
export function readParquet(parquet_file, options) {
    const ptr0 = passArray8ToWasm0(parquet_file, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.readParquet(ptr0, len0, isLikeNone(options) ? 0 : addToExternrefTable0(options));
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Table.__wrap(ret[0]);
}

/**
 * Read an Arrow schema from a Parquet file in memory.
 *
 * This returns an Arrow schema in WebAssembly memory. To transfer the Arrow schema to JavaScript
 * memory you have two options:
 *
 * - (Easier): Call {@linkcode Schema.intoIPCStream} to construct a buffer that can be parsed with
 *   Arrow JS's `tableFromIPC` function. This results in an Arrow JS Table with zero rows but a
 *   valid schema.
 * - (More performant but bleeding edge): Call {@linkcode Schema.intoFFI} to construct a data
 *   representation that can be parsed zero-copy from WebAssembly with
 *   [arrow-js-ffi](https://github.com/kylebarron/arrow-js-ffi) using `parseSchema`.
 *
 * Example with IPC Stream:
 *
 * ```js
 * import { tableFromIPC } from "apache-arrow";
 * import initWasm, {readSchema} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * const resp = await fetch("https://example.com/file.parquet");
 * const parquetUint8Array = new Uint8Array(await resp.arrayBuffer());
 * const arrowWasmSchema = readSchema(parquetUint8Array);
 * const arrowTable = tableFromIPC(arrowWasmSchema.intoIPCStream());
 * const arrowSchema = arrowTable.schema;
 * ```
 *
 * Example with `arrow-js-ffi`:
 *
 * ```js
 * import { parseSchema } from "arrow-js-ffi";
 * import initWasm, {readSchema, wasmMemory} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 * const WASM_MEMORY = wasmMemory();
 *
 * const resp = await fetch("https://example.com/file.parquet");
 * const parquetUint8Array = new Uint8Array(await resp.arrayBuffer());
 * const arrowWasmSchema = readSchema(parquetUint8Array);
 * const ffiSchema = arrowWasmSchema.intoFFI();
 * const arrowTable = parseSchema(WASM_MEMORY.buffer, ffiSchema.addr());
 * const arrowSchema = arrowTable.schema;
 * ```
 *
 * @param parquet_file Uint8Array containing Parquet data
 * @param {Uint8Array} parquet_file
 * @returns {Schema}
 */
export function readSchema(parquet_file) {
    const ptr0 = passArray8ToWasm0(parquet_file, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.readSchema(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Schema.__wrap(ret[0]);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * Write Arrow data to a Parquet file.
 *
 * For example, to create a Parquet file with Snappy compression:
 *
 * ```js
 * import { tableToIPC } from "apache-arrow";
 * // Edit the `parquet-wasm` import as necessary
 * import initWasm, {
 *   Table,
 *   WriterPropertiesBuilder,
 *   Compression,
 *   writeParquet,
 * } from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * // Given an existing arrow JS table under `table`
 * const wasmTable = Table.fromIPCStream(tableToIPC(table, "stream"));
 * const writerProperties = new WriterPropertiesBuilder()
 *   .setCompression(Compression.SNAPPY)
 *   .build();
 * const parquetUint8Array = writeParquet(wasmTable, writerProperties);
 * ```
 *
 * If `writerProperties` is not provided or is `null`, the default writer properties will be used.
 * This is equivalent to `new WriterPropertiesBuilder().build()`.
 *
 * @param table A {@linkcode Table} representation in WebAssembly memory.
 * @param writer_properties (optional) Configuration for writing to Parquet. Use the {@linkcode
 * WriterPropertiesBuilder} to build a writing configuration, then call `.build()` to create an
 * immutable writer properties to pass in here.
 * @returns Uint8Array containing written Parquet data.
 * @param {Table} table
 * @param {WriterProperties | null} [writer_properties]
 * @returns {Uint8Array}
 */
export function writeParquet(table, writer_properties) {
    _assertClass(table, Table);
    var ptr0 = table.__destroy_into_raw();
    let ptr1 = 0;
    if (!isLikeNone(writer_properties)) {
        _assertClass(writer_properties, WriterProperties);
        ptr1 = writer_properties.__destroy_into_raw();
    }
    const ret = wasm.writeParquet(ptr0, ptr1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Read a Parquet file into a stream of Arrow `RecordBatch`es.
 *
 * This returns a ReadableStream containing RecordBatches in WebAssembly memory. To transfer the
 * Arrow table to JavaScript memory you have two options:
 *
 * - (Easier): Call {@linkcode RecordBatch.intoIPCStream} to construct a buffer that can be parsed
 *   with Arrow JS's `tableFromIPC` function. (The table will have a single internal record
 *   batch).
 * - (More performant but bleeding edge): Call {@linkcode RecordBatch.intoFFI} to construct a data
 *   representation that can be parsed zero-copy from WebAssembly with
 *   [arrow-js-ffi](https://github.com/kylebarron/arrow-js-ffi) using `parseRecordBatch`.
 *
 * Example with IPC stream:
 *
 * ```js
 * import { tableFromIPC, Table } from "apache-arrow";
 * import initWasm, {readParquetStream} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * const stream = await readParquetStream(url);
 *
 * const batches = [];
 * for await (const wasmRecordBatch of stream) {
 *   const arrowTable = tableFromIPC(wasmRecordBatch.intoIPCStream());
 *   batches.push(...arrowTable.batches);
 * }
 * const table = new Table(batches);
 * ```
 *
 * Example with `arrow-js-ffi`:
 *
 * ```js
 * import { Table } from "apache-arrow";
 * import { parseRecordBatch } from "arrow-js-ffi";
 * import initWasm, {readParquetStream, wasmMemory} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 * const WASM_MEMORY = wasmMemory();
 *
 * const stream = await readParquetStream(url);
 *
 * const batches = [];
 * for await (const wasmRecordBatch of stream) {
 *   const ffiRecordBatch = wasmRecordBatch.intoFFI();
 *   const recordBatch = parseRecordBatch(
 *     WASM_MEMORY.buffer,
 *     ffiRecordBatch.arrayAddr(),
 *     ffiRecordBatch.schemaAddr(),
 *     true
 *   );
 *   batches.push(recordBatch);
 * }
 * const table = new Table(batches);
 * ```
 *
 * @param url URL to Parquet file
 * @param {string} url
 * @param {number | null} [content_length]
 * @returns {Promise<ReadableStream>}
 */
export function readParquetStream(url, content_length) {
    const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.readParquetStream(ptr0, len0, isLikeNone(content_length) ? 0x100000001 : (content_length) >>> 0);
    return ret;
}

/**
 * Transform a ReadableStream of RecordBatches to a ReadableStream of bytes
 *
 * Browser example with piping to a file via the File System API:
 *
 * ```js
 * import initWasm, {ParquetFile, transformParquetStream} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * const fileInstance = await ParquetFile.fromUrl("https://example.com/file.parquet");
 * const recordBatchStream = await fileInstance.stream();
 * const serializedParquetStream = await transformParquetStream(recordBatchStream);
 * // NB: requires transient user activation - you would typically do this before ☝️
 * const handle = await window.showSaveFilePicker();
 * const writable = await handle.createWritable();
 * await serializedParquetStream.pipeTo(writable);
 * ```
 *
 * NodeJS (ESM) example with piping to a file:
 * ```js
 * import { open } from "node:fs/promises";
 * import { Writable } from "node:stream";
 * import initWasm, {ParquetFile, transformParquetStream} from "parquet-wasm";
 *
 * // Instantiate the WebAssembly context
 * await initWasm();
 *
 * const fileInstance = await ParquetFile.fromUrl("https://example.com/file.parquet");
 * const recordBatchStream = await fileInstance.stream();
 * const serializedParquetStream = await transformParquetStream(recordBatchStream);
 *
 * // grab a file handle via fsPromises
 * const handle = await open("file.parquet");
 * const destinationStream = Writable.toWeb(handle.createWriteStream());
 * await serializedParquetStream.pipeTo(destinationStream);
 *
 * ```
 * NB: the above is a little contrived - `await writeFile("file.parquet", serializedParquetStream)`
 * is enough for most use cases.
 *
 * Browser kitchen sink example - teeing to the Cache API, using as a streaming post body, transferring
 * to a Web Worker:
 * ```js
 * // prelude elided - see above
 * const serializedParquetStream = await transformParquetStream(recordBatchStream);
 * const [cacheStream, bodyStream] = serializedParquetStream.tee();
 * const postProm = fetch(targetUrl, {
 *     method: "POST",
 *     duplex: "half",
 *     body: bodyStream
 * });
 * const targetCache = await caches.open("foobar");
 * await targetCache.put("https://example.com/file.parquet", new Response(cacheStream));
 * // this could have been done with another tee, but beware of buffering
 * const workerStream = await targetCache.get("https://example.com/file.parquet").body;
 * const worker = new Worker("worker.js");
 * worker.postMessage(workerStream, [workerStream]);
 * await postProm;
 * ```
 *
 * @param stream A {@linkcode ReadableStream} of {@linkcode RecordBatch} instances
 * @param writer_properties (optional) Configuration for writing to Parquet. Use the {@linkcode
 * WriterPropertiesBuilder} to build a writing configuration, then call `.build()` to create an
 * immutable writer properties to pass in here.
 * @returns ReadableStream containing serialized Parquet data.
 * @param {ReadableStream} stream
 * @param {WriterProperties | null} [writer_properties]
 * @returns {Promise<ReadableStream>}
 */
export function transformParquetStream(stream, writer_properties) {
    let ptr0 = 0;
    if (!isLikeNone(writer_properties)) {
        _assertClass(writer_properties, WriterProperties);
        ptr0 = writer_properties.__destroy_into_raw();
    }
    const ret = wasm.transformParquetStream(stream, ptr0);
    return ret;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * Returns a handle to this wasm instance's `WebAssembly.Memory`
 * @returns {Memory}
 */
export function wasmMemory() {
    const ret = wasm.wasmMemory();
    return ret;
}

/**
 * Returns a handle to this wasm instance's `WebAssembly.Table` which is the indirect function
 * table used by Rust
 * @returns {FunctionTable}
 */
export function _functionTable() {
    const ret = wasm._functionTable();
    return ret;
}

function __wbg_adapter_6(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hfec9c6c02f6046ed(arg0, arg1);
}

function __wbg_adapter_15(arg0, arg1, arg2) {
    wasm.closure3789_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_268(arg0, arg1, arg2, arg3) {
    wasm.closure3803_externref_shim(arg0, arg1, arg2, arg3);
}

/**
 * Supported compression algorithms.
 *
 * Codecs added in format version X.Y can be read by readers based on X.Y and later.
 * Codec support may vary between readers based on the format version and
 * libraries available at runtime.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const Compression = Object.freeze({
    UNCOMPRESSED: 0, "0": "UNCOMPRESSED",
    SNAPPY: 1, "1": "SNAPPY",
    GZIP: 2, "2": "GZIP",
    BROTLI: 3, "3": "BROTLI",
    /**
     * @deprecated as of Parquet 2.9.0.
     * Switch to LZ4_RAW
     */
    LZ4: 4, "4": "LZ4",
    ZSTD: 5, "5": "ZSTD",
    LZ4_RAW: 6, "6": "LZ4_RAW",
    LZO: 7, "7": "LZO",
});
/**
 * Controls the level of statistics to be computed by the writer
 * @enum {0 | 1 | 2}
 */
export const EnabledStatistics = Object.freeze({
    /**
     * Compute no statistics
     */
    None: 0, "0": "None",
    /**
     * Compute chunk-level statistics but not page-level
     */
    Chunk: 1, "1": "Chunk",
    /**
     * Compute page-level and chunk-level statistics
     */
    Page: 2, "2": "Page",
});
/**
 * Encodings supported by Parquet.
 * Not all encodings are valid for all types. These enums are also used to specify the
 * encoding of definition and repetition levels.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
 */
export const Encoding = Object.freeze({
    /**
     * Default byte encoding.
     * - BOOLEAN - 1 bit per value, 0 is false; 1 is true.
     * - INT32 - 4 bytes per value, stored as little-endian.
     * - INT64 - 8 bytes per value, stored as little-endian.
     * - FLOAT - 4 bytes per value, stored as little-endian.
     * - DOUBLE - 8 bytes per value, stored as little-endian.
     * - BYTE_ARRAY - 4 byte length stored as little endian, followed by bytes.
     * - FIXED_LEN_BYTE_ARRAY - just the bytes are stored.
     */
    PLAIN: 0, "0": "PLAIN",
    /**
     * **Deprecated** dictionary encoding.
     *
     * The values in the dictionary are encoded using PLAIN encoding.
     * Since it is deprecated, RLE_DICTIONARY encoding is used for a data page, and
     * PLAIN encoding is used for dictionary page.
     */
    PLAIN_DICTIONARY: 1, "1": "PLAIN_DICTIONARY",
    /**
     * Group packed run length encoding.
     *
     * Usable for definition/repetition levels encoding and boolean values.
     */
    RLE: 2, "2": "RLE",
    /**
     * Bit packed encoding.
     *
     * This can only be used if the data has a known max width.
     * Usable for definition/repetition levels encoding.
     */
    BIT_PACKED: 3, "3": "BIT_PACKED",
    /**
     * Delta encoding for integers, either INT32 or INT64.
     *
     * Works best on sorted data.
     */
    DELTA_BINARY_PACKED: 4, "4": "DELTA_BINARY_PACKED",
    /**
     * Encoding for byte arrays to separate the length values and the data.
     *
     * The lengths are encoded using DELTA_BINARY_PACKED encoding.
     */
    DELTA_LENGTH_BYTE_ARRAY: 5, "5": "DELTA_LENGTH_BYTE_ARRAY",
    /**
     * Incremental encoding for byte arrays.
     *
     * Prefix lengths are encoded using DELTA_BINARY_PACKED encoding.
     * Suffixes are stored using DELTA_LENGTH_BYTE_ARRAY encoding.
     */
    DELTA_BYTE_ARRAY: 6, "6": "DELTA_BYTE_ARRAY",
    /**
     * Dictionary encoding.
     *
     * The ids are encoded using the RLE encoding.
     */
    RLE_DICTIONARY: 7, "7": "RLE_DICTIONARY",
    /**
     * Encoding for floating-point data.
     *
     * K byte-streams are created where K is the size in bytes of the data type.
     * The individual bytes of an FP value are scattered to the corresponding stream and
     * the streams are concatenated.
     * This itself does not reduce the size of the data but can lead to better compression
     * afterwards.
     */
    BYTE_STREAM_SPLIT: 8, "8": "BYTE_STREAM_SPLIT",
});
/**
 * The Parquet version to use when writing
 * @enum {0 | 1}
 */
export const WriterVersion = Object.freeze({
    V1: 0, "0": "V1",
    V2: 1, "1": "V2",
});

const __wbindgen_enum_ReadableStreamType = ["bytes"];

const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const ColumnChunkMetaDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_columnchunkmetadata_free(ptr >>> 0, 1));
/**
 * Metadata for a Parquet column chunk.
 */
export class ColumnChunkMetaData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ColumnChunkMetaData.prototype);
        obj.__wbg_ptr = ptr;
        ColumnChunkMetaDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ColumnChunkMetaDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_columnchunkmetadata_free(ptr, 0);
    }
    /**
     * File where the column chunk is stored.
     *
     * If not set, assumed to belong to the same file as the metadata.
     * This path is relative to the current file.
     * @returns {string | undefined}
     */
    filePath() {
        const ret = wasm.columnchunkmetadata_filePath(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Byte offset in `file_path()`.
     * @returns {bigint}
     */
    fileOffset() {
        const ret = wasm.columnchunkmetadata_fileOffset(this.__wbg_ptr);
        return ret;
    }
    /**
     * Path (or identifier) of this column.
     * @returns {string[]}
     */
    columnPath() {
        const ret = wasm.columnchunkmetadata_columnPath(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * All encodings used for this column.
     * @returns {any[]}
     */
    encodings() {
        const ret = wasm.columnchunkmetadata_encodings(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Total number of values in this column chunk.
     * @returns {number}
     */
    numValues() {
        const ret = wasm.columnchunkmetadata_numValues(this.__wbg_ptr);
        return ret;
    }
    /**
     * Compression for this column.
     * @returns {Compression}
     */
    compression() {
        const ret = wasm.columnchunkmetadata_compression(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the total compressed data size of this column chunk.
     * @returns {number}
     */
    compressedSize() {
        const ret = wasm.columnchunkmetadata_compressedSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the total uncompressed data size of this column chunk.
     * @returns {number}
     */
    uncompressedSize() {
        const ret = wasm.columnchunkmetadata_uncompressedSize(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) ColumnChunkMetaData.prototype[Symbol.dispose] = ColumnChunkMetaData.prototype.free;

const FFIDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ffidata_free(ptr >>> 0, 1));
/**
 * An Arrow array exported to FFI.
 *
 * Using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi), you can view or copy Arrow
 * these objects to JavaScript.
 *
 * Note that this also includes an ArrowSchema C struct as well, so that extension type
 * information can be maintained.
 * ## Memory management
 *
 * Note that this array will not be released automatically. You need to manually call `.free()` to
 * release memory.
 */
export class FFIData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FFIData.prototype);
        obj.__wbg_ptr = ptr;
        FFIDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FFIDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ffidata_free(ptr, 0);
    }
    /**
     * Access the pointer to the
     * [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
     * struct. This can be viewed or copied (without serialization) to an Arrow JS `RecordBatch` by
     * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
     * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
     * instance by using {@linkcode wasmMemory}.
     *
     * **Example**:
     *
     * ```ts
     * import { parseRecordBatch } from "arrow-js-ffi";
     *
     * const wasmRecordBatch: FFIRecordBatch = ...
     * const wasmMemory: WebAssembly.Memory = wasmMemory();
     *
     * // Pass `true` to copy arrays across the boundary instead of creating views.
     * const jsRecordBatch = parseRecordBatch(
     *   wasmMemory.buffer,
     *   wasmRecordBatch.arrayAddr(),
     *   wasmRecordBatch.schemaAddr(),
     *   true
     * );
     * ```
     * @returns {number}
     */
    arrayAddr() {
        const ret = wasm.ffidata_arrayAddr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Access the pointer to the
     * [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
     * struct. This can be viewed or copied (without serialization) to an Arrow JS `Field` by
     * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
     * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
     * instance by using {@linkcode wasmMemory}.
     *
     * **Example**:
     *
     * ```ts
     * import { parseRecordBatch } from "arrow-js-ffi";
     *
     * const wasmRecordBatch: FFIRecordBatch = ...
     * const wasmMemory: WebAssembly.Memory = wasmMemory();
     *
     * // Pass `true` to copy arrays across the boundary instead of creating views.
     * const jsRecordBatch = parseRecordBatch(
     *   wasmMemory.buffer,
     *   wasmRecordBatch.arrayAddr(),
     *   wasmRecordBatch.schemaAddr(),
     *   true
     * );
     * ```
     * @returns {number}
     */
    schemaAddr() {
        const ret = wasm.ffidata_schemaAddr(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) FFIData.prototype[Symbol.dispose] = FFIData.prototype.free;

const FFISchemaFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ffischema_free(ptr >>> 0, 1));

export class FFISchema {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FFISchema.prototype);
        obj.__wbg_ptr = ptr;
        FFISchemaFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FFISchemaFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ffischema_free(ptr, 0);
    }
    /**
     * Access the pointer to the
     * [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
     * struct. This can be viewed or copied (without serialization) to an Arrow JS `Field` by
     * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
     * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
     * instance by using {@linkcode wasmMemory}.
     *
     * **Example**:
     *
     * ```ts
     * import { parseRecordBatch } from "arrow-js-ffi";
     *
     * const wasmRecordBatch: FFIRecordBatch = ...
     * const wasmMemory: WebAssembly.Memory = wasmMemory();
     *
     * // Pass `true` to copy arrays across the boundary instead of creating views.
     * const jsRecordBatch = parseRecordBatch(
     *   wasmMemory.buffer,
     *   wasmRecordBatch.arrayAddr(),
     *   wasmRecordBatch.schemaAddr(),
     *   true
     * );
     * ```
     * @returns {number}
     */
    addr() {
        const ret = wasm.ffischema_addr(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) FFISchema.prototype[Symbol.dispose] = FFISchema.prototype.free;

const FFIStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ffistream_free(ptr >>> 0, 1));
/**
 * A representation of an Arrow C Stream in WebAssembly memory exposed as FFI-compatible
 * structs through the Arrow C Data Interface.
 *
 * Unlike other Arrow implementations outside of JS, this always stores the "stream" fully
 * materialized as a sequence of Arrow chunks.
 */
export class FFIStream {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FFIStream.prototype);
        obj.__wbg_ptr = ptr;
        FFIStreamFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FFIStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ffistream_free(ptr, 0);
    }
    /**
     * Get the total number of elements in this stream
     * @returns {number}
     */
    numArrays() {
        const ret = wasm.ffistream_numArrays(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the pointer to the ArrowSchema FFI struct
     * @returns {number}
     */
    schemaAddr() {
        const ret = wasm.ffistream_schemaAddr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the pointer to one ArrowArray FFI struct for a given chunk index and column index
     *
     * Access the pointer to one
     * [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
     * struct representing one of the internal `RecordBatch`es. This can be viewed or copied (without serialization) to an Arrow JS `RecordBatch` by
     * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
     * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
     * instance by using {@linkcode wasmMemory}.
     *
     * **Example**:
     *
     * ```ts
     * import * as arrow from "apache-arrow";
     * import { parseRecordBatch } from "arrow-js-ffi";
     *
     * const wasmTable: FFITable = ...
     * const wasmMemory: WebAssembly.Memory = wasmMemory();
     *
     * const jsBatches: arrow.RecordBatch[] = []
     * for (let i = 0; i < wasmTable.numBatches(); i++) {
     *   // Pass `true` to copy arrays across the boundary instead of creating views.
     *   const jsRecordBatch = parseRecordBatch(
     *     wasmMemory.buffer,
     *     wasmTable.arrayAddr(i),
     *     wasmTable.schemaAddr(),
     *     true
     *   );
     *   jsBatches.push(jsRecordBatch);
     * }
     * const jsTable = new arrow.Table(jsBatches);
     * ```
     *
     * @param chunk number The chunk index to use
     * @returns number pointer to an ArrowArray FFI struct in Wasm memory
     * @param {number} chunk
     * @returns {number}
     */
    arrayAddr(chunk) {
        const ret = wasm.ffistream_arrayAddr(this.__wbg_ptr, chunk);
        return ret >>> 0;
    }
    /**
     * @returns {Uint32Array}
     */
    arrayAddrs() {
        const ret = wasm.ffistream_arrayAddrs(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    drop() {
        const ptr = this.__destroy_into_raw();
        wasm.ffistream_drop(ptr);
    }
}
if (Symbol.dispose) FFIStream.prototype[Symbol.dispose] = FFIStream.prototype.free;

const FileMetaDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_filemetadata_free(ptr >>> 0, 1));
/**
 * Metadata for a Parquet file.
 */
export class FileMetaData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FileMetaData.prototype);
        obj.__wbg_ptr = ptr;
        FileMetaDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FileMetaDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_filemetadata_free(ptr, 0);
    }
    /**
     * Returns version of this file.
     * @returns {number}
     */
    version() {
        const ret = wasm.filemetadata_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns number of rows in the file.
     * @returns {number}
     */
    numRows() {
        const ret = wasm.filemetadata_numRows(this.__wbg_ptr);
        return ret;
    }
    /**
     * String message for application that wrote this file.
     *
     * This should have the following format:
     * `<application> version <application version> (build <application build hash>)`.
     *
     * ```shell
     * parquet-mr version 1.8.0 (build 0fda28af84b9746396014ad6a415b90592a98b3b)
     * ```
     * @returns {string | undefined}
     */
    createdBy() {
        const ret = wasm.filemetadata_createdBy(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Returns key_value_metadata of this file.
     * @returns {Map<any, any>}
     */
    keyValueMetadata() {
        const ret = wasm.filemetadata_keyValueMetadata(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) FileMetaData.prototype[Symbol.dispose] = FileMetaData.prototype.free;

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}
if (Symbol.dispose) IntoUnderlyingByteSource.prototype[Symbol.dispose] = IntoUnderlyingByteSource.prototype.free;

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSink.prototype[Symbol.dispose] = IntoUnderlyingSink.prototype.free;

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IntoUnderlyingSource.prototype);
        obj.__wbg_ptr = ptr;
        IntoUnderlyingSourceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}
if (Symbol.dispose) IntoUnderlyingSource.prototype[Symbol.dispose] = IntoUnderlyingSource.prototype.free;

const ParquetFileFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_parquetfile_free(ptr >>> 0, 1));

export class ParquetFile {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ParquetFile.prototype);
        obj.__wbg_ptr = ptr;
        ParquetFileFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParquetFileFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parquetfile_free(ptr, 0);
    }
    /**
     * Construct a ParquetFile from a new URL.
     * @param {string} url
     * @returns {Promise<ParquetFile>}
     */
    static fromUrl(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.parquetfile_fromUrl(ptr0, len0);
        return ret;
    }
    /**
     * Construct a ParquetFile from a new [Blob] or [File] handle.
     *
     * [Blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
     * [File]: https://developer.mozilla.org/en-US/docs/Web/API/File
     *
     * Safety: Do not use this in a multi-threaded environment,
     * (transitively depends on `!Send` `web_sys::Blob`)
     * @param {Blob} handle
     * @returns {Promise<ParquetFile>}
     */
    static fromFile(handle) {
        const ret = wasm.parquetfile_fromFile(handle);
        return ret;
    }
    /**
     * @returns {ParquetMetaData}
     */
    metadata() {
        const ret = wasm.parquetfile_metadata(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ParquetMetaData.__wrap(ret[0]);
    }
    /**
     * @returns {Schema}
     */
    schema() {
        const ret = wasm.parquetfile_schema(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Schema.__wrap(ret[0]);
    }
    /**
     * Read from the Parquet file in an async fashion.
     *
     * @param options
     *
     *    Options for reading Parquet data. Optional keys include:
     *
     *    - `batchSize`: The number of rows in each batch. If not provided, the upstream parquet
     *           default is 1024.
     *    - `rowGroups`: Only read data from the provided row group indexes.
     *    - `limit`: Provide a limit to the number of rows to be read.
     *    - `offset`: Provide an offset to skip over the given number of rows.
     *    - `columns`: The column names from the file to read.
     * @param {ReaderOptions | null} [options]
     * @returns {Promise<Table>}
     */
    read(options) {
        const ret = wasm.parquetfile_read(this.__wbg_ptr, isLikeNone(options) ? 0 : addToExternrefTable0(options));
        return ret;
    }
    /**
     * Create a readable stream of record batches.
     *
     * Each item in the stream will be a {@linkcode RecordBatch}.
     *
     * @param options
     *
     *    Options for reading Parquet data. Optional keys include:
     *
     *    - `batchSize`: The number of rows in each batch. If not provided, the upstream parquet
     *           default is 1024.
     *    - `rowGroups`: Only read data from the provided row group indexes.
     *    - `limit`: Provide a limit to the number of rows to be read.
     *    - `offset`: Provide an offset to skip over the given number of rows.
     *    - `columns`: The column names from the file to read.
     *    - `concurrency`: The number of concurrent requests to make
     * @param {ReaderOptions | null} [options]
     * @returns {Promise<ReadableStream>}
     */
    stream(options) {
        const ret = wasm.parquetfile_stream(this.__wbg_ptr, isLikeNone(options) ? 0 : addToExternrefTable0(options));
        return ret;
    }
}
if (Symbol.dispose) ParquetFile.prototype[Symbol.dispose] = ParquetFile.prototype.free;

const ParquetMetaDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_parquetmetadata_free(ptr >>> 0, 1));
/**
 * Global Parquet metadata.
 */
export class ParquetMetaData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ParquetMetaData.prototype);
        obj.__wbg_ptr = ptr;
        ParquetMetaDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParquetMetaDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parquetmetadata_free(ptr, 0);
    }
    /**
     * Returns file metadata as reference.
     * @returns {FileMetaData}
     */
    fileMetadata() {
        const ret = wasm.parquetmetadata_fileMetadata(this.__wbg_ptr);
        return FileMetaData.__wrap(ret);
    }
    /**
     * Returns number of row groups in this file.
     * @returns {number}
     */
    numRowGroups() {
        const ret = wasm.parquetmetadata_numRowGroups(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns row group metadata for `i`th position.
     * Position should be less than number of row groups `num_row_groups`.
     * @param {number} i
     * @returns {RowGroupMetaData}
     */
    rowGroup(i) {
        const ret = wasm.parquetmetadata_rowGroup(this.__wbg_ptr, i);
        return RowGroupMetaData.__wrap(ret);
    }
    /**
     * Returns row group metadata for all row groups
     * @returns {RowGroupMetaData[]}
     */
    rowGroups() {
        const ret = wasm.parquetmetadata_rowGroups(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) ParquetMetaData.prototype[Symbol.dispose] = ParquetMetaData.prototype.free;

const RecordBatchFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_recordbatch_free(ptr >>> 0, 1));
/**
 * A group of columns of equal length in WebAssembly memory with an associated {@linkcode Schema}.
 */
export class RecordBatch {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RecordBatch.prototype);
        obj.__wbg_ptr = ptr;
        RecordBatchFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof RecordBatch)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RecordBatchFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_recordbatch_free(ptr, 0);
    }
    /**
     * The number of rows in this RecordBatch.
     * @returns {number}
     */
    get numRows() {
        const ret = wasm.recordbatch_numRows(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The number of columns in this RecordBatch.
     * @returns {number}
     */
    get numColumns() {
        const ret = wasm.recordbatch_numColumns(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The {@linkcode Schema} of this RecordBatch.
     * @returns {Schema}
     */
    get schema() {
        const ret = wasm.recordbatch_schema(this.__wbg_ptr);
        return Schema.__wrap(ret);
    }
    /**
     * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
     *
     * This method **does not consume** the RecordBatch, so you must remember to call {@linkcode
     * RecordBatch.free} to release the resources. The underlying arrays are reference counted, so
     * this method does not copy data, it only prevents the data from being released.
     * @returns {FFIData}
     */
    toFFI() {
        const ret = wasm.recordbatch_toFFI(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFIData.__wrap(ret[0]);
    }
    /**
     * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
     *
     * This method **does consume** the RecordBatch, so the original RecordBatch will be
     * inaccessible after this call. You must still call {@linkcode FFIRecordBatch.free} after
     * you've finished using the FFIRecordBatch.
     * @returns {FFIData}
     */
    intoFFI() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.recordbatch_intoFFI(ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFIData.__wrap(ret[0]);
    }
    /**
     * Consume this RecordBatch and convert to an Arrow IPC Stream buffer
     * @returns {Uint8Array}
     */
    intoIPCStream() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.recordbatch_intoIPCStream(ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Override the schema of this [`RecordBatch`]
     *
     * Returns an error if `schema` is not a superset of the current schema
     * as determined by [`Schema::contains`]
     * @param {Schema} schema
     * @returns {RecordBatch}
     */
    withSchema(schema) {
        _assertClass(schema, Schema);
        var ptr0 = schema.__destroy_into_raw();
        const ret = wasm.recordbatch_withSchema(this.__wbg_ptr, ptr0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return RecordBatch.__wrap(ret[0]);
    }
    /**
     * Return a new RecordBatch where each column is sliced
     * according to `offset` and `length`
     * @param {number} offset
     * @param {number} length
     * @returns {RecordBatch}
     */
    slice(offset, length) {
        const ret = wasm.recordbatch_slice(this.__wbg_ptr, offset, length);
        return RecordBatch.__wrap(ret);
    }
    /**
     * Returns the total number of bytes of memory occupied physically by this batch.
     * @returns {number}
     */
    getArrayMemorySize() {
        const ret = wasm.recordbatch_getArrayMemorySize(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) RecordBatch.prototype[Symbol.dispose] = RecordBatch.prototype.free;

const RowGroupMetaDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rowgroupmetadata_free(ptr >>> 0, 1));
/**
 * Metadata for a Parquet row group.
 */
export class RowGroupMetaData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RowGroupMetaData.prototype);
        obj.__wbg_ptr = ptr;
        RowGroupMetaDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RowGroupMetaDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rowgroupmetadata_free(ptr, 0);
    }
    /**
     * Number of columns in this row group.
     * @returns {number}
     */
    numColumns() {
        const ret = wasm.rowgroupmetadata_numColumns(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns column chunk metadata for `i`th column.
     * @param {number} i
     * @returns {ColumnChunkMetaData}
     */
    column(i) {
        const ret = wasm.rowgroupmetadata_column(this.__wbg_ptr, i);
        return ColumnChunkMetaData.__wrap(ret);
    }
    /**
     * Returns column chunk metadata for all columns
     * @returns {ColumnChunkMetaData[]}
     */
    columns() {
        const ret = wasm.rowgroupmetadata_columns(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Number of rows in this row group.
     * @returns {number}
     */
    numRows() {
        const ret = wasm.rowgroupmetadata_numRows(this.__wbg_ptr);
        return ret;
    }
    /**
     * Total byte size of all uncompressed column data in this row group.
     * @returns {number}
     */
    totalByteSize() {
        const ret = wasm.rowgroupmetadata_totalByteSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Total size of all compressed column data in this row group.
     * @returns {number}
     */
    compressedSize() {
        const ret = wasm.rowgroupmetadata_compressedSize(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) RowGroupMetaData.prototype[Symbol.dispose] = RowGroupMetaData.prototype.free;

const SchemaFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_schema_free(ptr >>> 0, 1));
/**
 * A named collection of types that defines the column names and types in a RecordBatch or Table
 * data structure.
 *
 * A Schema can also contain extra user-defined metadata either at the Table or Column level.
 * Column-level metadata is often used to define [extension
 * types](https://arrow.apache.org/docs/format/Columnar.html#extension-types).
 */
export class Schema {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Schema.prototype);
        obj.__wbg_ptr = ptr;
        SchemaFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SchemaFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_schema_free(ptr, 0);
    }
    /**
     * Export this schema to an FFISchema object, which can be read with arrow-js-ffi.
     *
     * This method **does not consume** the Schema, so you must remember to call {@linkcode
     * Schema.free} to release the resources. The underlying arrays are reference counted, so
     * this method does not copy data, it only prevents the data from being released.
     * @returns {FFISchema}
     */
    toFFI() {
        const ret = wasm.schema_toFFI(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFISchema.__wrap(ret[0]);
    }
    /**
     * Export this Table to FFI structs according to the Arrow C Data Interface.
     *
     * This method **does consume** the Table, so the original Table will be
     * inaccessible after this call. You must still call {@linkcode FFITable.free} after
     * you've finished using the FFITable.
     * @returns {FFISchema}
     */
    intoFFI() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.schema_intoFFI(ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFISchema.__wrap(ret[0]);
    }
    /**
     * Consume this schema and convert to an Arrow IPC Stream buffer
     * @returns {Uint8Array}
     */
    intoIPCStream() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.schema_intoIPCStream(ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Sets the metadata of this `Schema` to be `metadata` and returns a new object
     * @param {SchemaMetadata} metadata
     * @returns {Schema}
     */
    withMetadata(metadata) {
        const ret = wasm.schema_withMetadata(this.__wbg_ptr, metadata);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Schema.__wrap(ret[0]);
    }
    /**
     * Find the index of the column with the given name.
     * @param {string} name
     * @returns {number}
     */
    indexOf(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.schema_indexOf(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] >>> 0;
    }
    /**
     * Returns an immutable reference to the Map of custom metadata key-value pairs.
     * @returns {SchemaMetadata}
     */
    metadata() {
        const ret = wasm.schema_metadata(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) Schema.prototype[Symbol.dispose] = Schema.prototype.free;

const TableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_table_free(ptr >>> 0, 1));
/**
 * A Table in WebAssembly memory conforming to the Apache Arrow spec.
 *
 * A Table consists of one or more {@linkcode RecordBatch} objects plus a {@linkcode Schema} that
 * each RecordBatch conforms to.
 */
export class Table {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Table.prototype);
        obj.__wbg_ptr = ptr;
        TableFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TableFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_table_free(ptr, 0);
    }
    /**
     * Access the Table's {@linkcode Schema}.
     * @returns {Schema}
     */
    get schema() {
        const ret = wasm.table_schema(this.__wbg_ptr);
        return Schema.__wrap(ret);
    }
    /**
     * Access a RecordBatch from the Table by index.
     *
     * @param index The positional index of the RecordBatch to retrieve.
     * @returns a RecordBatch or `null` if out of range.
     * @param {number} index
     * @returns {RecordBatch | undefined}
     */
    recordBatch(index) {
        const ret = wasm.table_recordBatch(this.__wbg_ptr, index);
        return ret === 0 ? undefined : RecordBatch.__wrap(ret);
    }
    /**
     * @returns {RecordBatch[]}
     */
    recordBatches() {
        const ret = wasm.table_recordBatches(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * The number of batches in the Table
     * @returns {number}
     */
    get numBatches() {
        const ret = wasm.table_numBatches(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Export this Table to FFI structs according to the Arrow C Data Interface.
     *
     * This method **does not consume** the Table, so you must remember to call {@linkcode
     * Table.free} to release the resources. The underlying arrays are reference counted, so
     * this method does not copy data, it only prevents the data from being released.
     * @returns {FFIStream}
     */
    toFFI() {
        const ret = wasm.table_toFFI(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFIStream.__wrap(ret[0]);
    }
    /**
     * Export this Table to FFI structs according to the Arrow C Data Interface.
     *
     * This method **does consume** the Table, so the original Table will be
     * inaccessible after this call. You must still call {@linkcode FFITable.free} after
     * you've finished using the FFITable.
     * @returns {FFIStream}
     */
    intoFFI() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.table_intoFFI(ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FFIStream.__wrap(ret[0]);
    }
    /**
     * Consume this table and convert to an Arrow IPC Stream buffer
     * @returns {Uint8Array}
     */
    intoIPCStream() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.table_intoIPCStream(ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Create a table from an Arrow IPC Stream buffer
     * @param {Uint8Array} buf
     * @returns {Table}
     */
    static fromIPCStream(buf) {
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.table_fromIPCStream(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Table.__wrap(ret[0]);
    }
    /**
     * Returns the total number of bytes of memory occupied physically by all batches in this
     * table.
     * @returns {number}
     */
    getArrayMemorySize() {
        const ret = wasm.table_getArrayMemorySize(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) Table.prototype[Symbol.dispose] = Table.prototype.free;

const WriterPropertiesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writerproperties_free(ptr >>> 0, 1));
/**
 * Immutable struct to hold writing configuration for `writeParquet`.
 *
 * Use {@linkcode WriterPropertiesBuilder} to create a configuration, then call {@linkcode
 * WriterPropertiesBuilder.build} to create an instance of `WriterProperties`.
 */
export class WriterProperties {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WriterProperties.prototype);
        obj.__wbg_ptr = ptr;
        WriterPropertiesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriterPropertiesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writerproperties_free(ptr, 0);
    }
}
if (Symbol.dispose) WriterProperties.prototype[Symbol.dispose] = WriterProperties.prototype.free;

const WriterPropertiesBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writerpropertiesbuilder_free(ptr >>> 0, 1));
/**
 * Builder to create a writing configuration for `writeParquet`
 *
 * Call {@linkcode build} on the finished builder to create an immputable {@linkcode WriterProperties} to pass to `writeParquet`
 */
export class WriterPropertiesBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WriterPropertiesBuilder.prototype);
        obj.__wbg_ptr = ptr;
        WriterPropertiesBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriterPropertiesBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writerpropertiesbuilder_free(ptr, 0);
    }
    /**
     * Returns default state of the builder.
     */
    constructor() {
        const ret = wasm.writerpropertiesbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        WriterPropertiesBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Finalizes the configuration and returns immutable writer properties struct.
     * @returns {WriterProperties}
     */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_build(ptr);
        return WriterProperties.__wrap(ret);
    }
    /**
     * Sets writer version.
     * @param {WriterVersion} value
     * @returns {WriterPropertiesBuilder}
     */
    setWriterVersion(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setWriterVersion(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets data page size limit.
     * @param {number} value
     * @returns {WriterPropertiesBuilder}
     */
    setDataPageSizeLimit(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setDataPageSizeLimit(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets dictionary page size limit.
     * @param {number} value
     * @returns {WriterPropertiesBuilder}
     */
    setDictionaryPageSizeLimit(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setDictionaryPageSizeLimit(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets write batch size.
     * @param {number} value
     * @returns {WriterPropertiesBuilder}
     */
    setWriteBatchSize(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setWriteBatchSize(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets maximum number of rows in a row group.
     * @param {number} value
     * @returns {WriterPropertiesBuilder}
     */
    setMaxRowGroupSize(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setMaxRowGroupSize(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets "created by" property.
     * @param {string} value
     * @returns {WriterPropertiesBuilder}
     */
    setCreatedBy(value) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.writerpropertiesbuilder_setCreatedBy(ptr, ptr0, len0);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets "key_value_metadata" property.
     * @param {KeyValueMetadata} value
     * @returns {WriterPropertiesBuilder}
     */
    setKeyValueMetadata(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setKeyValueMetadata(ptr, value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WriterPropertiesBuilder.__wrap(ret[0]);
    }
    /**
     * Sets encoding for any column.
     *
     * If dictionary is not enabled, this is treated as a primary encoding for all
     * columns. In case when dictionary is enabled for any column, this value is
     * considered to be a fallback encoding for that column.
     *
     * Panics if user tries to set dictionary encoding here, regardless of dictionary
     * encoding flag being set.
     * @param {Encoding} value
     * @returns {WriterPropertiesBuilder}
     */
    setEncoding(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setEncoding(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets compression codec for any column.
     * @param {Compression} value
     * @returns {WriterPropertiesBuilder}
     */
    setCompression(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setCompression(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets flag to enable/disable dictionary encoding for any column.
     *
     * Use this method to set dictionary encoding, instead of explicitly specifying
     * encoding in `set_encoding` method.
     * @param {boolean} value
     * @returns {WriterPropertiesBuilder}
     */
    setDictionaryEnabled(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setDictionaryEnabled(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets flag to enable/disable statistics for any column.
     * @param {EnabledStatistics} value
     * @returns {WriterPropertiesBuilder}
     */
    setStatisticsEnabled(value) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.writerpropertiesbuilder_setStatisticsEnabled(ptr, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets encoding for a column.
     * Takes precedence over globally defined settings.
     *
     * If dictionary is not enabled, this is treated as a primary encoding for this
     * column. In case when dictionary is enabled for this column, either through
     * global defaults or explicitly, this value is considered to be a fallback
     * encoding for this column.
     *
     * Panics if user tries to set dictionary encoding here, regardless of dictionary
     * encoding flag being set.
     * @param {string} col
     * @param {Encoding} value
     * @returns {WriterPropertiesBuilder}
     */
    setColumnEncoding(col, value) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(col, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.writerpropertiesbuilder_setColumnEncoding(ptr, ptr0, len0, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets compression codec for a column.
     * Takes precedence over globally defined settings.
     * @param {string} col
     * @param {Compression} value
     * @returns {WriterPropertiesBuilder}
     */
    setColumnCompression(col, value) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(col, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.writerpropertiesbuilder_setColumnCompression(ptr, ptr0, len0, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets flag to enable/disable dictionary encoding for a column.
     * Takes precedence over globally defined settings.
     * @param {string} col
     * @param {boolean} value
     * @returns {WriterPropertiesBuilder}
     */
    setColumnDictionaryEnabled(col, value) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(col, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.writerpropertiesbuilder_setColumnDictionaryEnabled(ptr, ptr0, len0, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
    /**
     * Sets flag to enable/disable statistics for a column.
     * Takes precedence over globally defined settings.
     * @param {string} col
     * @param {EnabledStatistics} value
     * @returns {WriterPropertiesBuilder}
     */
    setColumnStatisticsEnabled(col, value) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(col, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.writerpropertiesbuilder_setColumnStatisticsEnabled(ptr, ptr0, len0, value);
        return WriterPropertiesBuilder.__wrap(ret);
    }
}
if (Symbol.dispose) WriterPropertiesBuilder.prototype[Symbol.dispose] = WriterPropertiesBuilder.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_Error_e17e777aac105295 = function(arg0, arg1) {
        const ret = Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_Number_998bea33bd87c3e0 = function(arg0) {
        const ret = Number(arg0);
        return ret;
    };
    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_abort_67e1b49bf6614565 = function(arg0) {
        arg0.abort();
    };
    imports.wbg.__wbg_abort_d830bf2e9aa6ec5b = function(arg0, arg1) {
        arg0.abort(arg1);
    };
    imports.wbg.__wbg_append_72a3c0addd2bce38 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_2c907ed8e8ef4e35 = function(arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    };
    imports.wbg.__wbg_arrayBuffer_9c99b8e2809e8cbb = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_8d40b1d762fb3c66 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_byobRequest_2c036bceca1e6037 = function(arg0) {
        const ret = arg0.byobRequest;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_byteLength_331a6b5545834024 = function(arg0) {
        const ret = arg0.byteLength;
        return ret;
    };
    imports.wbg.__wbg_byteOffset_49a5b5608000358b = function(arg0) {
        const ret = arg0.byteOffset;
        return ret;
    };
    imports.wbg.__wbg_call_13410aac570ffff7 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_a5400b25a865cfd8 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancel_8bb5b8f4906b658a = function(arg0) {
        const ret = arg0.cancel();
        return ret;
    };
    imports.wbg.__wbg_catch_c80ecae90cb8ed4e = function(arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    };
    imports.wbg.__wbg_clearTimeout_6222fede17abcb1a = function(arg0) {
        const ret = clearTimeout(arg0);
        return ret;
    };
    imports.wbg.__wbg_close_a1918cff3cac355b = function(arg0) {
        const ret = arg0.close();
        return ret;
    };
    imports.wbg.__wbg_close_cccada6053ee3a65 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_close_d71a78219dc23e91 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_columnchunkmetadata_new = function(arg0) {
        const ret = ColumnChunkMetaData.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_done_75ed0ee6dd243d9d = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_enqueue_452bc2343d1c2ff9 = function() { return handleError(function (arg0, arg1) {
        arg0.enqueue(arg1);
    }, arguments) };
    imports.wbg.__wbg_entries_2be2f15bd5554996 = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_fetch_87aed7f306ec6d63 = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_fetch_f156d10be9a5c88a = function(arg0) {
        const ret = fetch(arg0);
        return ret;
    };
    imports.wbg.__wbg_getReader_48e00749fe3f6089 = function() { return handleError(function (arg0) {
        const ret = arg0.getReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getWriter_03d7689e275ac6a4 = function() { return handleError(function (arg0) {
        const ret = arg0.getWriter();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_0da715ceaecea5c8 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_get_458e874b43b18b25 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getdone_f026246f6bbe58d3 = function(arg0) {
        const ret = arg0.done;
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg_getvalue_31e5a08f61e5aa42 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_has_b89e451f638123e3 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_headers_29fec3c72865cd75 = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_67f3012529f6a2dd = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_50fde2cd696850bf = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_9a8378d955933db7 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_030cce220591fb41 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_1c0d1af5542e102a = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_f370b34483c71a1c = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_186546c51cd61acd = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_6bb7e81f9d7713e4 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_new_19c25a3f2fa63a02 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_2e3c58a15f39f5f9 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_268(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_2ff1f68f3676ea53 = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_638ebfaedbf32a5e = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_66b9434b4e59b63e = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_99a6a948d5b3f607 = function() { return handleError(function () {
        const ret = new TransformStream();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_da9dc54c5db29dfa = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_new_f6e53210afea8e45 = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newfromslice_074c56947bd43469 = function(arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_254190557c45b4ec = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffset_6bd4b2a4ca518883 = function(arg0, arg1) {
        const ret = new Uint8Array(arg0, arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_e8f53910b4d42b45 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithintounderlyingsource_b47f6a6a596a7f24 = function(arg0, arg1) {
        const ret = new ReadableStream(IntoUnderlyingSource.__wrap(arg0), arg1);
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_b5d168a29a3fd85f = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_5b3530e612fde77d = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_692e82279131b03c = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_parquetfile_new = function(arg0) {
        const ret = ParquetFile.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_prototypesetcall_3d4a26c1ed734349 = function(arg0, arg1, arg2) {
        Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    };
    imports.wbg.__wbg_queueMicrotask_25d0739ac89e8c88 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_4488407636f5bf24 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_read_bc925c758aa4d897 = function(arg0) {
        const ret = arg0.read();
        return ret;
    };
    imports.wbg.__wbg_readable_e82cff27b968ed1c = function(arg0) {
        const ret = arg0.readable;
        return ret;
    };
    imports.wbg.__wbg_ready_4186da3cb500ae7d = function(arg0) {
        const ret = arg0.ready;
        return ret;
    };
    imports.wbg.__wbg_recordbatch_new = function(arg0) {
        const ret = RecordBatch.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_recordbatch_unwrap = function(arg0) {
        const ret = RecordBatch.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_releaseLock_62151472ae632176 = function(arg0) {
        arg0.releaseLock();
    };
    imports.wbg.__wbg_releaseLock_ff29b586502a8221 = function(arg0) {
        arg0.releaseLock();
    };
    imports.wbg.__wbg_resolve_4055c623acdd6a1b = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_respond_6c2c4e20ef85138e = function() { return handleError(function (arg0, arg1) {
        arg0.respond(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_rowgroupmetadata_new = function(arg0) {
        const ret = RowGroupMetaData.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_setTimeout_2b339866a2aa3789 = function(arg0, arg1) {
        const ret = setTimeout(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_set_1353b2a5e96bc48c = function(arg0, arg1, arg2) {
        arg0.set(getArrayU8FromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_b7f1cf4fae26fe2a = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_setbody_c8460bdf44147df8 = function(arg0, arg1) {
        arg0.body = arg1;
    };
    imports.wbg.__wbg_setcache_90ca4ad8a8ad40d3 = function(arg0, arg1) {
        arg0.cache = __wbindgen_enum_RequestCache[arg1];
    };
    imports.wbg.__wbg_setcredentials_9cd60d632c9d5dfc = function(arg0, arg1) {
        arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
    };
    imports.wbg.__wbg_setheaders_0052283e2f3503d1 = function(arg0, arg1) {
        arg0.headers = arg1;
    };
    imports.wbg.__wbg_sethighwatermark_3d5961f834647d41 = function(arg0, arg1) {
        arg0.highWaterMark = arg1;
    };
    imports.wbg.__wbg_setmethod_9b504d5b855b329c = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmode_a23e1a2ad8b512f8 = function(arg0, arg1) {
        arg0.mode = __wbindgen_enum_RequestMode[arg1];
    };
    imports.wbg.__wbg_setsignal_8c45ad1247a74809 = function(arg0, arg1) {
        arg0.signal = arg1;
    };
    imports.wbg.__wbg_signal_da4d466ce86118b5 = function(arg0) {
        const ret = arg0.signal;
        return ret;
    };
    imports.wbg.__wbg_size_8f84e7768fba0589 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_slice_224856d46230c13c = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.slice(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_8921f820c2ce3f12 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_f0a4409105898184 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_995b214ae681ff99 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_cde3890479c675ea = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_status_3fea3036088621d6 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_stringify_b98c93d0a190446a = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_table_new = function(arg0) {
        const ret = Table.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_then_b33a773d723afa3e = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_then_e22500defe16819f = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_toString_78df35411a4fd40c = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_url_e5720dfacf77b05e = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_dd9372230531eade = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_view_91cc97d57ab30530 = function(arg0) {
        const ret = arg0.view;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_wbindgenbigintgetasi64_ac743ece6ab9bba1 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg_wbindgenbooleanget_3fe6f642c7d97746 = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? v : undefined;
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg_wbindgencbdrop_eb10308566512b88 = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_wbindgendebugstring_99ef257a3ddda34d = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgenfunctiontable_aa1084b2969a9cbe = function() {
        const ret = wasm.__wbindgen_export_5;
        return ret;
    };
    imports.wbg.__wbg_wbindgenin_d7a1ee10933d2d55 = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbg_wbindgenisbigint_ecb90cc08a5a9154 = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbg_wbindgenisfunction_8cee7dce3725ae74 = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbg_wbindgenisobject_307a53c6bd97fbf8 = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_wbindgenisstring_d4fa939789f003b0 = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbg_wbindgenisundefined_c4b71d073b92f3c5 = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_wbindgenjsvaleq_e6f2ad59ccae1b58 = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbg_wbindgenjsvallooseeq_9bec8c9be826bed1 = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbg_wbindgenmemory_d84da70f7c42d172 = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbg_wbindgennumberget_f74b4c7525ac05cb = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg_wbindgenstringget_0f16a6ddddef376f = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_writable_e5202c9fd57615db = function(arg0) {
        const ret = arg0.writable;
        return ret;
    };
    imports.wbg.__wbg_write_2e39e04a4c8c9e9d = function(arg0, arg1) {
        const ret = arg0.write(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(arg0) {
        // Cast intrinsic for `U64 -> Externref`.
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_cast_e9d4edd5d697755b = function(arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 317, function: Function { arguments: [], shim_idx: 318, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, 317, __wbg_adapter_6);
        return ret;
    };
    imports.wbg.__wbindgen_cast_eb8544ce08914b2c = function(arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 3778, function: Function { arguments: [Externref], shim_idx: 3789, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, 3778, __wbg_adapter_15);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_4;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('parquet_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

