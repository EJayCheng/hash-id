import { HashId } from "./index";
let hash = new HashId({ salt: "27737f30d0ee3835555b639f9e972e01" });
for (let i = 1; i <= 1000; i++) {
  console.log(hash.encode(i));
}
