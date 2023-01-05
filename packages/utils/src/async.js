const myAsync = (generatorFn) => {
  return function (...args) {
    const _generatorFn = generatorFn.apply(this, args);

    return new Promise((resolve, reject) => {
      const step = ({ error, value } = {}) => {
        if (error) {
          return reject(error);
        }

        const generatorFnResult = _generatorFn.next(value);

        if (generatorFnResult.done) {
          return resolve(generatorFnResult.value);
        }

        return Promise.resolve(generatorFnResult.value).then(
          (value) => {
            step({ value });
          },
          (error) => {
            step({ error });
          },
        );
      };

      step();
    });
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getUserName = async () => {
  await sleep(1000);
  return 'misty';
};

// async
(async (fnName) => {
  const userName = await getUserName();
  console.log(fnName, { userName });

  const userName2 = await getUserName();
  console.log(fnName, { userName2 });
})('async');

// myAsync
myAsync(function* generatorFn(fnName) {
  const userName = yield getUserName();
  console.log(fnName, { userName });

  const userName2 = yield getUserName();
  console.log(fnName, { userName2 });
})('myAsync');
