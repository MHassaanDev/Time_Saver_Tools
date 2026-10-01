// Minimal, dependency-free MD5 implementation (public-domain algorithm,
// reimplemented compactly). Web Crypto's crypto.subtle.digest() does NOT
// support MD5 (by design — it's deprecated for security use), but MD5 is
// still commonly requested for checksums/legacy compatibility, so it's
// implemented directly here rather than pulling in an npm package.
// Clearly labeled in the UI as non-cryptographically-secure — see
// src/tools/HashGeneratorTool.jsx.
export function md5(input) {
  function rotl(x, c) { return (x << c) | (x >>> (32 - c)) }
  function toBytesUTF8(str) { return new TextEncoder().encode(str) }

  const s = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
             5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
             4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
             6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21]
  const K = new Int32Array(64)
  for (let i = 0; i < 64; i++) K[i] = (Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)) | 0

  const bytes = toBytesUTF8(input)
  const bitLen = bytes.length * 8
  let msg = Array.from(bytes)
  msg.push(0x80)
  while (msg.length % 64 !== 56) msg.push(0)
  for (let i = 0; i < 8; i++) msg.push((bitLen / Math.pow(2, 8 * i)) & 0xff)

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476

  for (let chunkStart = 0; chunkStart < msg.length; chunkStart += 64) {
    const M = new Int32Array(16)
    for (let i = 0; i < 16; i++) {
      M[i] = msg[chunkStart + i * 4] | (msg[chunkStart + i * 4 + 1] << 8) |
             (msg[chunkStart + i * 4 + 2] << 16) | (msg[chunkStart + i * 4 + 3] << 24)
    }
    let [A, B, C, D] = [a0, b0, c0, d0]
    for (let i = 0; i < 64; i++) {
      let F, g
      if (i < 16) { F = (B & C) | (~B & D); g = i }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = (F + A + K[i] + M[g]) | 0
      A = D; D = C; C = B
      B = (B + rotl(F, s[i])) | 0
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0
  }

  function toHex(n) {
    const bytes = [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0)
}
