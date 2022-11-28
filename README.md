# Autocomplete

[![storybook](https://shields.io/badge/storybook-white?logo=storybook&style=flat)](https://xyshaokang.github.io/autocomplete) [![npm version](https://img.shields.io/npm/v/@xyshaokang/autocomplete.svg?label=@xyshaokang/autocomplete)](https://www.npmjs.com/package/@xyshaokang/autocomplete) [![Release](https://github.com/XYShaoKang/autocomplete/workflows/Release/badge.svg)](https://github.com/XYShaoKang/autocomplete/actions?query=branch%3Amaster)

## 安装

```sh
npm install @xyshaokang/autocomplete
```

## 使用

```ts
import Autocomplete from '@xyshaokang/autocomplete'

function App() {
  const options = ['126', '124', '125', '234', '2345']
  return <Autocomplete options={options} placeholder="type text" />
}

export default App
```
