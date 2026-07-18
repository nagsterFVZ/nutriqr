# NutriQR

> Ultra-compact nutrition data encoding for QR codes

[![npm version](https://img.shields.io/npm/v/nutriqr.svg)](https://www.npmjs.com/package/nutriqr)
[![License: MIT + Commons Clause](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-yellow.svg)](LICENSE)

NutriQR is a specification and library ecosystem for encoding complete nutrition information into ultra-compact QR codes. By packing all mandatory EU nutrition labeling data into under 160 bytes (depending on product name and manufacturer name), NutriQR enables offline nutrition tracking and fast product identification without relying on external databases.

## 🎯 Purpose

Traditional nutrition apps rely on cloud databases for product information, leading to:

- Slow lookup times and poor offline experiences
- Incomplete or outdated nutrition data
- Privacy concerns from data tracking
- High infrastructure costs for app developers

NutriQR solves these problems by embedding complete nutrition information directly in QR codes that can be printed on product packaging, enabling:

- **Instant offline scanning** - No internet required for nutrition data
- **Complete nutrition profiles** - All mandatory EU labeling data included
- **International compatibility** - Supports both metric (g/ml) and imperial (oz/fl oz) units
- **Product linking** - Optional GTIN-13 support for external database integration
- **Ultra-compact encoding** - Fits in small QR codes suitable for packaging

## 📋 Specification

The complete technical specification is available in [`spec.md`](spec.md).

NutriQR encodes nutrition data as a minified JSON array with six fixed positions, wrapped in an `NQR1:` envelope prefix:

```js
[
  "1234567890128", // GTIN-13 product identifier
  "GrainWorks|Protein Oats", // Brand|Product name
  "g", // Base unit (g/ml/oz/fl)
  100, // Base quantity
  0.4, // Portion multiplier
  [415, 13, 5.6, 43, 9.7, 0.47, 25, 8.5], // Nutrients (kcal,fat,sat fat,carbs,sugars,salt,protein,fiber)
];
```

This example encodes complete nutrition information for 100g of oats in just 87 bytes (array only) — 92 bytes once minified with the `NQR1:` envelope prefix included, as it would appear in the actual QR payload:

```
NQR1:["1234567890128","GrainWorks|Protein Oats","g",100,0.4,[415,13,5.6,43,9.7,0.47,25,8.5]]
```

<figure>
  <img src="example-nutriqr.png" alt="NutriQR Example" width="120" style="border-radius:16px" />
  <figcaption>The above example as a QR code</figcaption>
</figure>

## 📦 Packages

> `packages/` contains language implementations of the NutriQR spec (see [Adding New Language Packages](#adding-new-language-packages) below). Consumer applications — currently the docs/demo website — live under [`apps/`](apps/web/).

### Available

| Package                   | Language              | Status     | Description                                                |
| ------------------------- | --------------------- | ---------- | ---------------------------------------------------------- |
| [`nutriqr`](packages/ts/) | TypeScript/JavaScript | ✅ **WIP** | Full encoding/decoding with unit conversion and validation |

### Planned

| Package   | Language | Status             | Timeline                     |
| --------- | -------- | ------------------ | ---------------------------- |
| `nutriqr` | Swift    | 📋 **Planned**     | iOS-first implementation     |
| `nutriqr` | Kotlin   | 📋 **Planned**     | Android-first implementation |
| `nutriqr` | Python   | 📋 **Maybe**       | Data science and backend use |
| `nutriqr` | C#       | 📋 **Maybe**       | .NET ecosystem support       |

## 🌐 Website (Docs & Live Demo)

A Nuxt/Vue site at [`apps/web`](apps/web/) hosts the spec showcase, hand-written documentation, and an interactive live demo — edit nutrition data and watch the `NQR1:...` string and QR code update in real time, in both directions.

```bash
npm install                      # from the repo root — installs all workspaces
npm run dev --workspace=apps/web # or: npm run dev
```

Then open `http://localhost:3000`. The site depends on the local `nutriqr` package (`packages/ts`) via an npm workspace — no separate build step is needed; edits to `packages/ts/src` are picked up live.

## 🚀 Quick Start

### TypeScript/JavaScript

```bash
npm install nutriqr
```

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

## 🔧 Development

### Prerequisites

- Node.js 18+ (for TypeScript package)
- Git

### Setup

```bash
git clone https://github.com/nagsterFVZ/nutriqr.git
cd nutriqr/packages/ts
npm install
npm test
```

## 🤝 Contributing

We welcome contributions! Whether you're:

- Implementing NutriQR in a new language
- Improving existing packages
- Enhancing the specification
- Adding documentation or examples

Please feel free to open issues and pull requests.

### Adding New Language Packages

If you'd like to implement NutriQR in a new language:

1. Create a new directory under `packages/`
2. Follow the specification in [`spec.md`](spec.md)
3. Implement the core functions: encode, decode, validate
4. Add comprehensive tests
5. Include unit conversion utilities
6. Update this README

## 📄 License

The reference implementation code (`packages/`, `apps/`) is licensed under MIT with the [Commons Clause](https://commonsclause.com/) — free to use and embed, including in commercial products and services, but not to resell or repackage the software itself as a competing product. See the [LICENSE](LICENSE) file for details.

The [format specification](spec.md) itself is licensed separately and more permissively, so anyone can freely implement NutriQR in any language — see [spec.md §10](spec.md#10-license).

## 🔗 Links

- [Technical Specification](spec.md) - Complete NutriQR format specification
- [TypeScript Package](packages/ts/) - Reference implementation
- [GitHub Repository](https://github.com/nagsterFVZ/nutriqr) - Source code and issues

---

_Built with ❤️ for better nutrition transparency_
