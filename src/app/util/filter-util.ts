export function filterOf(filter, params) {
  const names = Object.getOwnPropertyNames(filter);
  for (let i = 0; i < names.length; i++) {
    if (params.has(names[i])) {
      if (typeof filter[names[i]] === 'boolean') {
        filter[names[i]] = +params.get(names[i]) === 1;
      } else if (typeof filter[names[i]] === 'number') {
        filter[names[i]] = +params.get(names[i]);
      } else if (typeof filter[names[i]] === 'string') {
        filter[names[i]] = params.get(names[i]);
      }
    }
  }
  return filter;
}

export function asParam(filter) {
  const p = {};
  const names = Object.getOwnPropertyNames(filter);
  for (let i = 0; i < names.length; i++) {
    if (typeof filter[names[i]] === 'boolean' && filter[names[i]] === true) {
      p[names[i]] = 1;
    } else if (typeof filter[names[i]] === 'number') {
      p[names[i]] = filter[names[i]];
    } else if (typeof filter[names[i]] === 'string') {
      p[names[i]] = filter[names[i]];
    }
  }
  return p;
}
