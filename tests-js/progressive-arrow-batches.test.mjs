import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

globalThis.window = globalThis;

const firstBatch = {name: "first"};
const secondBatch = {name: "second"};
const responseBody = {name: "response stream"};
const original = {props: {id: "existing", zIndex: 0}};
const overlay = {
  _props: {layers: [original]},
  history: [],
  setProps(value) {
    this._props = {...this._props, ...value};
    this.history.push(value.layers.slice());
  }
};

globalThis.fetch = async () => ({ok: true, body: responseBody});
globalThis.Arrow = {
  RecordBatchReader: {
    from: async body => {
      assert.strictEqual(body, responseBody);
      return {
        async *[Symbol.asyncIterator]() {
          yield firstBatch;
          assert.equal(overlay.history.length, 1);
          yield secondBatch;
        }
      };
    }
  }
};

vm.runInThisContext(
  fs.readFileSync("inst/htmlwidgets/progressiveArrowBatches.js", "utf8")
);

await loadGeoArrowLayers(
  overlay,
  "http://example/data.arrow",
  {layerId: "points", extension_type: "arrow"},
  (batch, id) => ({props: {id, zIndex: 1}, batch})
);

assert.equal(overlay.history.length, 2);
assert.strictEqual(overlay.history[1][0], original);
assert.deepEqual(
  overlay.history[1].map(layer => layer.props.id),
  ["existing", "points-0", "points-1"]
);
assert.strictEqual(overlay.history[0][1].batch, firstBatch);
assert.strictEqual(overlay.history[1][2].batch, secondBatch);

const fgbBatch = {name: "flatgeobuf"};
const fgbOverlay = {
  _props: {layers: []},
  setProps(value) { this._props = {...this._props, ...value}; }
};
globalThis.parse2ArrowTable = async (response, extensionType) => {
  assert.equal(response.ok, true);
  assert.equal(extensionType, "fgb");
  return {batches: [fgbBatch]};
};

await loadGeoArrowLayers(
  fgbOverlay,
  "http://example/data.fgb",
  {layerId: "polygons", extension_type: "fgb"},
  (batch, id) => ({props: {id, zIndex: 1}, batch})
);

assert.deepEqual(
  fgbOverlay._props.layers.map(layer => layer.props.id),
  ["polygons-0"]
);
assert.strictEqual(fgbOverlay._props.layers[0].batch, fgbBatch);

console.log("progressive Arrow batch tests passed");
