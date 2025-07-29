## NutriQR — _Ultra‑Compact Nutrition Payload_

### Specification v 1.0 (2025‑07‑29)

---

### 1. Purpose

NutriQR encodes **all mandatory EU on‑pack nutrition data** (plus selected optionals) in the smallest possible JSON payload for QR codes.
The format trades human readability for byte‑level compactness; reference libraries are expected to expand the payload into developer‑friendly objects.

NutriQR codes allow for offline nutrional data capturing for applications such as callorie trackers.
By not rellying on external databases for the key nutrional data apps can be faster and cheaper.

#### Benefits

- Extremely compact (~100–130 bytes), optimized for QR printing
- Supports both metric and imperial units for international use
- Includes GTIN support for linking to external product databases
- Offline-capable: all key nutrition info embedded in the code itself

---

### 2. Normative data model

The entire payload is a **single JSON array** with **five fixed positions**:

| Idx | Type     | Name (description)                                       | Required | Notes                                              |
| --: | -------- | -------------------------------------------------------- | -------- | -------------------------------------------------- |
|   0 | `string` | **GTIN-13** — Used for product identification            | ✔︎       | `"8720828249062"` (see 4.1)                        |
|   1 | `string` | **Product‑Manufacturer** — combined name, delimiter `\|` | ✔︎       | `"Brand\|Product"` (see 4.2)                       |
|   2 | `string` | **Base unit**                                            | ✔︎       | `"g" \| "ml" \| "oz" \| "fl"` _(lower‑case)_       |
|   3 | `number` | **Base quantity**                                        | ✔︎       | Usually `100` (per 100 g / ml)                     |
|   4 | `number` | **Portion multiplier**                                   | ✔︎       | Fraction of _base quantity_ (e.g. `0.4` ⇒ 40 g/ml) |
|   5 | `array`  | **Nutrients** (fixed order, see table 2)                 | ✔︎       | `length ≥ 7`, `≤ 8` today                          |

#### 2.1 Fixed nutrient order

Positioning is **strict**. Numbers are expressed **per *base quantity*** (index 2).

| Pos | Nutrient (EU labelling term) | Required       | Example |
| --: | ---------------------------- | -------------- | ------- |
|   0 | Energy **(kcal)**            | ✔︎             | `415`   |
|   1 | Fat                          | ✔︎             | `13`    |
|   2 | Saturated fat                | ✔︎             | `5.6`   |
|   3 | Carbohydrates                | ✔︎             | `43`    |
|   4 | Sugars                       | ✔︎             | `9.7`   |
|   5 | Salt                         | ✔︎             | `0.47`  |
|   6 | Protein                      | ✔︎             | `25`    |
|   7 | Fibre                        | ☐ _(optional)_ | `8.5`   |

_If fibre is absent the array terminates at position 6._

---

### 3. Encoding rules

| Rule            | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| Character set   | UTF‑8 only.                                                     |
| JSON formatting | **Minified** – _no whitespace_.                                 |
| Decimal format  | Dot (`.`) as radix, arbitrary precision.                        |
| Array lengths   | 6 top‑level items **exactly**; nutrient array ≥ 7.              |
| Units           | Lower‑case SI symbols (`"g"`, `"ml"`, `"oz"`, `"fl"`).          |
| Portion         | Always supplied; use `1` if _base quantity_ equals the serving. |

---

### 4. String conventions

#### 4.1 GTIN‑13 (optional product identifier)

The **GTIN** (Global Trade Item Number) is a globally unique identifier for retail products, commonly encoded in EAN‑13 barcodes. It must be added as the **first element** (index `0`) in the top‑level array.

- The GTIN must be provided as a **string of 13 digits**
- Leading zeros must be preserved (e.g. `"0012345678905"`)
- Only **GTIN‑13** is currently supported (13 digits total)
- No separators, spaces, or formatting characters allowed
- If no GTIN is available, the value at index 0 must be an empty string ("") to preserve array layout.

#### 4.2 `|` delimiter

`|` separates **manufacturer** and **product**.
If either contains `|`, escape by `\`: `Acme\|Foods|Protein Bar` → splits to `Acme|Foods` / `Protein Bar`.

#### 4.2 Length limits (recommendations)

| Field        | Soft max |
| ------------ | -------- |
| Manufacturer | 40 bytes |
| Product      | 60 bytes |

---

### 5. Unit handling

The `unit` field specifies the measurement unit used for both the base quantity and the nutrient values. It must be one of the following lowercase string values:

| Code | Description             | Use Cases                    |
| ---- | ----------------------- | ---------------------------- |
| `g`  | Grams                   | Most solid foods (EU/US)     |
| `ml` | Milliliters             | Most liquids (EU/US)         |
| `oz` | Ounces (28.35 g)        | US/UK snack portions, cereal |
| `fl` | Fluid ounces (29.57 ml) | US/UK drinks, sauces         |

All nutrient values in the array are assumed to be **per base quantity** in the unit given. For example, if `unit = "oz"` and `baseQuantity = 1`, then nutrients are given **per 1 ounce**.

---

### 6. Reference example (spec v 1.0)

Pretty‑printed for clarity:

```jsonc
[
  "8720828249062",
  "Upfront|Eiwit Oats",
  "g",
  100,
  0.4,
  [415, 13, 5.6, 43, 9.7, 0.47, 25, 8.5]
]
```

**Minified (payload string):**

```
["8720828249062","Upfront|Eiwit Oats","g",100,0.4,[415,13,5.6,43,9.7,0.47,25,8.5]]
```

---

### 7. Parsing & Libraries

This specification defines the structure and ordering of NutriQR data, but **does not prescribe implementation logic**.

For parsing, formatting, and validation, use the official NutriQR libraries found in the [NutriQR repository](https://github.com/nagsterFVZ/nutriqr)

These libraries expose methods to decode and normalize the compact array into a developer-friendly object with named fields, unit conversion, and portion calculation.

---

### 8. Versioning

**Spec version** is implicit (array layout). No version identifier to save on bytes.

---

### 9. Compliance checklist

1. Top‑level JSON array length == 6
2. Nutrient sub‑array 8 ≥ length ≥ 7
3. Mandatory positions populated with finite numbers
4. Unit is `"g"`, `"ml"`, `"oz"` or `"fl"`
5. No whitespace in final QR payload
6. UTF‑8 encoding

---

### 10. License

This specification is released under the **MIT License**. Contributions welcome via pull‑requests.

---

_End of specification v 1.0_
