import StorageBuilder from "./StorageBuilder.js";

let sb = new StorageBuilder();
sb.uint128Slot(1,49,12);

console.log(sb.outputJson());
