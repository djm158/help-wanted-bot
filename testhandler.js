let handler = require('./index').handler

handler({},
  {},
  function (data, ss) {
    console.log(data);
  });