<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">Versioning</h1>
    <p class="mt-4 text-neutral-700">
      Every payload starts with an explicit version marker,
      <code>NQR&lt;version&gt;:</code>, where the version number identifies
      the array-layout revision that follows. This site documents
      <strong>version 1</strong> (prefix <code>NQR1:</code>).
    </p>

    <ul class="mt-6 space-y-4 text-neutral-700">
      <li>
        <strong class="text-neutral-950">Non-breaking changes</strong> — e.g.
        widening a numeric range, relaxing a validation rule, or adding a new
        optional trailing nutrient — do not require a version bump.
      </li>
      <li>
        <strong class="text-neutral-950">Breaking changes</strong> to the
        array layout — reordering, removing, or repurposing a fixed position,
        or changing the meaning of an existing index — require incrementing
        the version, e.g. <code>NQR2:</code> for the next breaking revision.
      </li>
      <li>
        Implementations must reject payloads that do not begin with a
        syntactically valid <code>NQR&lt;digits&gt;:</code> prefix.
      </li>
      <li>
        Implementations must reject — or clearly surface as unsupported —
        payloads whose version they don't recognize, rather than attempting
        to parse the array as if it matched a known layout.
      </li>
    </ul>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      Compliance checklist
    </h2>
    <ol class="mt-4 list-decimal space-y-2 pl-5 text-neutral-700">
      <li>
        Payload string begins with a syntactically valid
        <code>NQR&lt;version&gt;:</code> prefix, immediately followed by the
        JSON array (no whitespace).
      </li>
      <li>Top-level JSON array length == 6.</li>
      <li>Nutrient sub-array length is 7 or 8.</li>
      <li>Mandatory positions are populated with finite numbers.</li>
      <li>Unit is <code>"g"</code>, <code>"ml"</code>, <code>"oz"</code>, or <code>"fl"</code>.</li>
      <li>No whitespace anywhere in the final QR payload.</li>
      <li>UTF-8 encoding.</li>
    </ol>
  </DocsShell>
</template>
