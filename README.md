# Solidity Stoage Builder

For now just clone the repository, run `npm i` and import the file

# Usage
```
import StorageBuilder from "./StorageBuilder.js";

```

### Example 1

```javascript

let sb = new StorageBuilder();
sb.uint128Slot(1,49,12);

console.log(sb.outputJson());
```
### Example 2

```javascript
let sb = new StorageBuilder();

sb.string32Slot(3,"Foo");
sb.string32Slot(4,"BAR");
sb.uint256Slot(1,12);
let addr = "Ec5F15A077D7780a2164213976e126aAc1c48892"
sb.addressSlot(10,addr);

console.log(sb.outputJson())
```
