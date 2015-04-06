/* Decrypt a message */
function doDecrypt() {
  var v = form.get(), iv = v.iv, key = v.key, adata = v.adata, aes, ciphertext=v.ciphertext, rp = {};
  
  if (ciphertext.length === 0) { return; }
  if (!v.password && !v.key.length) {
    error("Can't decrypt: need a password or key!"); return;
  }
  
  if (ciphertext.match("{")) {
    /* it's jsonized */
    try {
      v.plaintext = sjcl.decrypt(v.password || v.key, ciphertext, {}, rp);
    } catch(e) {
      error("Can't decrypt: "+e);
      return;
    }
    v.mode = rp.mode;
    v.iv = rp.iv;
    v.adata = rp.adata;
    if (v.password) {
      v.salt = rp.salt;
      v.iter = rp.iter;
      v.keysize = rp.ks;
      v.tag = rp.ts;
    }
    v.key = rp.key;
    v.ciphertext = "";
    document.getElementById('plaintext').select();
  } else {
    /* it's raw */
    ciphertext = sjcl.codec.base64.toBits(ciphertext);
    if (iv.length === 0) {
      error("Can't decrypt: need an IV!"); return;
    }
    if (key.length === 0) {
      if (v.password.length) {
        doPbkdf2(true);
        key = v.key;
      }
    }
    aes = new sjcl.cipher.aes(key);
    
    try {
      v.plaintext = sjcl.codec.utf8String.fromBits(sjcl.mode[v.mode].decrypt(aes, ciphertext, iv, v.adata, v.tag));
      v.ciphertext = "";
      document.getElementById('plaintext').select();
    } catch (e) {
      error("Can't decrypt: " + e);
    }
  }
  form.set(v);
}

function extendKey(size) {
  form.key.set(form._extendedKey.slice(0,size));
}

function randomize(field, words, paranoia) {
  form[field].set(sjcl.random.randomWords(words, paranoia));
  if (field == 'salt') { form.key.set([]); }
}
