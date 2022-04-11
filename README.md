Cheeky forum - based on Next.js

## Development

```bash
$ yarn # install dependencies
$ yarn dev # start the dev server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production

We recommend deploying this site to [Vercel](https://vercel.com/) for the easy deployment. Alternatively, you may run the webite in the production mode.

### Method A: Run in the production mode

```bash
$ yarn # install dependencies
$ yarn build # build the project
$ yarn start # run in prod mode
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Method B: Export the site as static html

This is current **unsupported** due to the following usage in the project:

- [`next/image`](https://nextjs.org/docs/messages/export-image-api)
- [API route](https://nextjs.org/docs/messages/api-routes-static-export)
- [`getServerSideProps`](https://nextjs.org/docs/messages/prerender-error)

## Folder structure

```
(root)
├── .env.local          # the envrionment variables
├── README.md           # README of the project
├── next.config.js      # the config file for Next.js
├── package.json        # the package file for this project
├── postcss.config.js   # the postcss config (ref: https://v2.tailwindcss.com/docs/using-with-preprocessors#using-post-css-as-your-preprocessor)
├── public              # static assets like images and manifest
├── src                 # main source files
│   ├── components          # reuseable components
│   ├── constants           # contants of the project
│   ├── layout              # layout of the pages
│   ├── model               # model for the data
│   ├── pages               # definition of the pages
│   ├── recoil              # definition of the state management
│   ├── services            # definition of the core API
│   ├── styles              # definition of the styles
│   └── utilities           # helper, debug functions etc
├── tailwind.config.js  # the config file for TailwindCSS
└── yarn.lock           # the dependency file for the project
```
