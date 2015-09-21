var Join = require('join').Join
    , join = Join.create()
    , callbackA = join.add()
    , callbackB = join.add()
    , callbackC = join.add();

function abcComplete(aArgs, bArgs, cArgs) {
    console.log(aArgs[1] + bArgs[1] + cArgs[1]);
}

setTimeout(function () {
    callbackA(null, 'Hello');
}, 300);

setTimeout(function () {
    callbackB(null, 'World');
}, 1500);

setTimeout(function () {
    callbackC(null, '!');
}, 400);

// this must be called after all
join.then(abcComplete);

console.log('ddddd');

//https://www.npmjs.com/package/join