/* keep track of which salts have been used. */
var form, usedIvs = {'':1}, usedSalts = {'':1};



function loaded() {
  form = new formHandler('theForm', '');
  form._extendedKey = [];
  sjcl.random.startCollectors();
  document.getElementById("password").focus();
}



/* Encrypt a message */
function doEncrypt() {
  var v = form.get(), iv = v.iv, password = v.password, key = v.key, adata = v.adata, aes, plaintext=v.plaintext, dp = {}, ct, p;
  
  if (plaintext === '' && v.ciphertext.length) { return; }
  if (key.length == 0 && password.length == 0) {
    error("need a password or key!");
    return;
  }

  if (!v.freshiv || !usedIvs[v.iv]) { p.iv = v.iv; }
  if (!v.freshsalt || !usedSalts[v.salt]) { p.salt = v.salt; }
  ct = sjcl.encrypt(password || key, plaintext, p, dp).replace(/,/g,",\n");

  v.iv = dp.iv;//set iv field
  usedIvs[dp.iv] = 1;
  if (dp.salt) {
    v.salt = dp.salt;//set salt field
	
    usedSalts[dp.salt] = 1;
  }
  v.key = dp.key;//set key field
  
  if (v.json) {
    v.ciphertext = ct;//set cyphertext
    v.adata = '';
  } else {
    v.ciphertext = ct.match(/"ct":"([^"]*)"/)[1]; //"
  }
  
  form.set(v);

}