const md5 = require('md5');

function getKeyIndex(salt, num, hashCount = 1) {
    const hashes = [];     // All hashes
    const candidates = []; // Candidate keys
    const keys = [];       // Valid keys

    for (let i = 0; keys.length < 64; i++) {
        // Calculate & store hash
        let hash = salt + i;
        for (let x = 0; x < hashCount; x++) {
            hash = md5(hash);
        }
        hashes[i] = hash;

        // Check if hash is a candidate
        let match;
        if (match = hash.match(/(.)\1{2}/)) {
            candidates[i] = { i, hash, c: match[1] };
        }

        // Check if there is a previously valid candidate
        const candidate = candidates[i - 1000];
        if (candidate) {
            const matches = hashes.slice(i - 999).filter(h => (new RegExp(`${candidate.c}{5}`)).test(h));
            if (matches.length) {
                keys.push({
                    i: candidate.i,
                    hash,
                });
                console.log(`Found key #${keys.length}`, i - 1000);
            }
        }
    }

    return keys[num - 1].i;
}

console.log(getKeyIndex('qzyelonm', 64));