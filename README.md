# TypeScript Policy

This example is meant to be a boilerplate for your own typescript policy for validation or mutation on truefoundry.

All the required models can be imported from {./src/models.ts}

# How to build

After extracting the example, make sure that the dependencies are installed with:
```
npm install
```

Now compile the policy and generate the kubernetes manifests:
```
npm run compile

> ts-example-policy@0.1.0 compile
> tsc && webpack --config webpack.config.js
asset bundle.js 857 bytes [compared for emit] [minimized] (name: main)
./lib/index.js 223 bytes [built] [code generated]
./lib/policy.js 726 bytes [built] [code generated]
webpack 5.36.1 compiled successfully in 229 ms
```

# Run the policy locally
```Local Run
npx ts-node local_run.ts
```
