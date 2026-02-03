# @ipa-community/element-plus

based on [vue-component-library](https://github.com/ipa-community/vue-component-library)

1. [unplugin-vue-component](https://github.com/unplugin/unplugin-vue-components#readme)
2. [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)
3. [unplugin-icon](https://github.com/unplugin/unplugin-icons)
4. [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
5. [vue-i18n](https://vue-i18n.intlify.dev/guide/essentials/started.html)
6. [vueuse](https://vueuse.org/)
7. [lodash-es](https://lodash.com/)
8. [commitlint](https://commitlint.js.org/guides/getting-started.html)
9. [prettier](https://prettier.io/)
10. [eslint](https://zh-hans.eslint.org/docs/latest/use/getting-started)
11. [vitest](https://cn.vitest.dev/)
12. [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks/tree/master)
13. [husky](https://typicode.github.io/husky)
14. [release-it](https://github.com/release-it/release-it)

## branch

1. `branch main` is the common branch
2. `branch feat/main/element-plus` = `branch main` + `element-plus ui framework`
3. `branch feat/main/naive-ui` = `branch main` + `naive ui framework`

## tips

1. `import { createApp } from "@/shared";`

## usage

1. install dependencies

```bash
bun i
```

2. run dev server

```bash
bun run dev
```

3. build library

```bash
bun run build:lib
```

4. build the total project

```bash
bun run build
```

or

```bash
bun run build:hash
```

4. run test

```bash
bun run test
```

5. lint and format code

```bash
bun run lint
bun run format
```

6. release library

```bash
bun run release
```

or test release

```bash
bun run release --dry-run
```

## tips

1. **do not** use `unplugin-*` in `lib`

## TODO

- [ ] decrease package size
