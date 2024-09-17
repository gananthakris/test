const assert = require('assert');

function specToDecl(name, type, spec, n=10) {
  if (typeof spec === 'string') spec = spec.split('');
  let decl = name;
  const n1 = spec.length - 1;
  for (const [i, constr] of spec.entries()) {
    switch (constr) {
    case 'a':
      decl += `[${n}]`;
      break;
    case 'f':
      decl += '()';
      break;
    case 'p': 
      decl = ptrDecl(decl, spec[i + 1]);
      break;
    }
  }
  return `${type} ${decl};`;
}

function specToText(name, type, spec, n=10) {
  if (typeof spec === 'string') spec = spec.split('');
  let text = `\`${name}\` is a `;
  for (const [i, constr] of spec.entries()) {
    switch (constr) {
    case 'a':
      text += `array of ${n} `;
      break;
    case 'f':
      text += 'function returning ';
      break;
    case 'p': 
      text += 'pointer to ';
      break;
    }
  }
  return fixupText(`${text}.~${type}~`);
}

function fixupText(text) {
  return text
    .replace(/\ba\s+array\b/g, 'an array')
    .replace(/(\d+)\s+(\w+)\b/g, '$1 $2s')
    .replace(/(\d+)\s+(\.\~\w+\~)/g, "$1 $2's");
}

function ptrDecl(decl, next)
{
  return (next && (next === 'f' || next === 'a'))
    ? `(*${decl})`
    : `*${decl}`;
}

function isErrorDecl(spec) {
  if (typeof spec === 'string') spec = spec.split('');
  for (const [i, constr] of spec.entries()) {
    if (constr === 'f') {
      const next = spec[i + 1];
      if (next) {
	if (next === 'f') return 'a function cannot return a function';
        if (next === 'a') return 'a function cannot return an array';
      }
    }
    else if (constr === 'a') {
      const next = spec[i + 1];
      if (next && next === 'f') return 'an array cannot contain functions'; 
    }
  }
  return false;
}

function permutations(obj) {
  const isStr = typeof obj === 'string';
  if (isStr) return permutations(obj.split('')).map(p => p.join(''));
  assert(obj instanceof Array);
  const list = obj;
  if (list.length <= 1) {
    return [ list ];
  }
  else {
    const head = list[0];
    const perms = [];
    for (const perm of permutations(list.slice(1))) {
      for (let i = 0; i < perm.length + 1; i++) {
	perms.push(perm.slice(0, i).concat([head]).concat(perm.slice(i)));
      }
    }
    return perms;
  }
}
	    
module.exports = { permutations, specToText, specToDecl, isErrorDecl, };


if (process.argv[1] === __filename) {
  console.log(permutations('1234'));
  
  const TESTS = [
    'afp',  //err
    'apa',  //ok
    'apf',  //ok
    'apfp', //ok
    'papf', //ok
    'pap',  //ok
    'pfa',  //err
    'pff',  //err
  ];

  for (const [i, t] of TESTS.entries()) {
    console.log(specToDecl(`x${i}`, 'int', t),
		'//',
		specToText(`x${i}`, 'int', t),
		isErrorDecl(t) || 'ok');
  }
  
}

