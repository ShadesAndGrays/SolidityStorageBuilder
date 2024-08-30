# Solidity Storage Builder

For now just clone the repository, run `npm i` and import the file

# Usage
```javascript
import StorageBuilder from "./StorageBuilder.js";

```

### Example 1

```javascript

let sb = new StorageBuilder();
sb.uint128Slot(1,49,12);

console.log(sb.outputJson());
// {"0000000000000000000000000000000000000000000000000000000000000001":"0000000000000000000000000000000c00000000000000000000000000000031"}

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
/*
{
  "0000000000000000000000000000000000000000000000000000000000000003": "466f6f0000000000000000000000000000000000000000000000000000000006",
  "0000000000000000000000000000000000000000000000000000000000000004": "4241520000000000000000000000000000000000000000000000000000000006",
  "0000000000000000000000000000000000000000000000000000000000000001": "000000000000000000000000000000000000000000000000000000000000000c",
  "000000000000000000000000000000000000000000000000000000000000000a": "0000000000000000000000ec5f15a077d7780a2164213976e126aac1c48892"
}
*/
```
