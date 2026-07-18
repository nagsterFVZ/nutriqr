# nutriqr

Reference TypeScript implementation of [NutriQR](https://github.com/nagsterFVZ/nutriqr) — a compact, open format for encoding EU nutrition-label data into a QR code payload.

Zero runtime dependencies. Ships as dual ESM/CJS with TypeScript types.

## Install

```bash
npm install nutriqr
```

## Quick start

```typescript
import { createNutriQRString, decodeNutriQRString } from "nutriqr";

// Create a NutriQR string
const nutriqr = createNutriQRString(
  "1234567890128",
  "GrainWorks",
  "Protein Oats",
  "g",
  100,
  0.4,
  {
    energyKcal: 415,
    fat: 13,
    saturatedFat: 5.6,
    carbs: 43,
    sugar: 9.7,
    salt: 0.47,
    protein: 25,
    fibre: 8.5,
  }
);
console.log(nutriqr); // "NQR1:[\"1234567890128\",...]"

// Decode a NutriQR string
const decoded = decodeNutriQRString(nutriqr);
console.log(decoded.productName); // "Protein Oats"
console.log(decoded.nutrients.protein); // 25 (per 100g base quantity)
console.log(decoded.portionQuantity); // 40 (actual serving size in grams)
```

`createNutriQRString` and `decodeNutriQRString` both throw a `NutriQRError` (with a typed `errorType` from `NutriQRErrorType`) on invalid input. `isNutriQRString(str)` gives a non-throwing validity check, and `convertUnit`/`convertDecodedNutriQR` convert between metric (g/ml) and imperial (oz/fl) units.

## Documentation

- [Full API reference and error types](https://github.com/nagsterFVZ/nutriqr/tree/main/packages/ts)
- [NutriQR format specification](https://github.com/nagsterFVZ/nutriqr/blob/main/spec.md)

## License

MIT, with the [Commons Clause](https://commonsclause.com/) — free to use, including in commercial products and services, but you may not sell the software itself (e.g. repackage or resell this library as a competing product). See [LICENSE](https://github.com/nagsterFVZ/nutriqr/blob/main/packages/ts/LICENSE) for the full text.
