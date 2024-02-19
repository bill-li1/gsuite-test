function runCode() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("done");
    }, 1000);
  });
}

console.log("sync 1");

runCode().then(function (result) {
  console.log(result);
});

console.log("sync 2");
