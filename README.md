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
> tsc && esbuild lib/index.js --bundle --minify --outfile=dist/bundle.js

  dist/bundle.js  2.1kb
  
⚡ Done in 5ms
```

# Run the policy locally
```Local Run
npx ts-node local_run.ts
```
