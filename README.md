# crittermound

> a complete rework of http://yoyz.com/critter/ with vuejs

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# run dev setup inside docker container (assuming pwd is project root)
docker run -p 8080:8080 -v $(pwd):/app -it --rm node bash
cd app
npm install
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Not implemented yet
 * Sod used for breeding
 * Animate workers
 * Mutations/Genes
 * Buying stuff
 * War
 * Achievements
