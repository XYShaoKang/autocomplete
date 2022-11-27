/**
 *
 * @param {import('@babel/core').ConfigAPI} api
 * @returns
 */
module.exports = api => {
  let options = {}
  if (api.env('test')) {
    options = { targets: { node: 'current' } }
  } else if (api.env('development')) {
    options = {
      shippedProposals: true,
      loose: true,
    }
  } else if (api.env('production')) {
    options = {
      targets: '>0.2%, not dead, not op_mini all',
    }
  }

  /**
   * @type {import('@babel/core').TransformOptions}
   */
  const babelConfig = {
    presets: [
      ['@babel/env', options],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: ['babel-plugin-styled-components'],
  }

  return babelConfig
}
