export class ArrayUtil {
  /**
   * The partition method organizes the elements of an array into a record (an object with key-value pairs) based on a specified key. The method allows for a flexible structure by optionally transforming the elements that are grouped into each partition.
   * @param arr (required) The array of elements to be partitioned. Each element of the array will be evaluated based on the provided keyGetter function.
   * @param keyGetter (required) A function that determines the key used to group elements. It takes an element from the array and returns a string, which is used as the key in the resulting object.
   * @param valueGetter (optional) A function that transforms the elements before they are added to their corresponding partition. If not provided, the original element will be used.
   * @returns Returns a Record (object) where the keys are the results of keyGetter, and the values are arrays containing elements grouped under that key. If valueGetter is provided, it transforms each element before it's added to the array.
   * @example ### partition by age
```ts
const students = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 }
];

const partitionedByAge = arr.partition(
  students,
  (elem) => String(elem.age)
);

console.log(partitionedByAge);
```

```
Output:
{
  "25": [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 25 }
  ],
  "30": [
    { name: 'Charlie', age: 30 }
  ]
}
```
### Group by age and the names of each group

```ts
const namesByAge = arr.partition( students,
  (elem) => String(elem.age),
  (elem) => eleme.name
);
console.log(namesByAge);
```

Output:
```
{
  "25": ["Alice", "Bob"],
  "30": ["Charlie"]
}
```
  */
  partition<T, U = undefined, V = U extends undefined ? T : U>(
    arr: T[],
    keyGetter: (elem: T) => string,
    valueGetter?: (elem: T) => U
  ): Record<string, V[]> {
    const obj: Record<string, V[]> = {};
    arr.forEach((elem) => {
      const key = keyGetter(elem);
      if (!obj[key]) {
        obj[key] = [];
      }
      const e = valueGetter ? valueGetter(elem) : elem;
      obj[key].push(e as V);
    });
    return obj;
  }
}
