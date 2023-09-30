module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-flow',
      ['@babel/preset-react', {runtime: 'automatic'}],
    ],
    plugins: [
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-class-properties',
      ]
  };
  
  