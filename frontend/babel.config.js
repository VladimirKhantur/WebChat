module.exports = {
  presets: [
    [
      '@babel/preset-env', // Пресет для поддержки современного JavaScript
      {
        targets: {
          node: 'current', // Для поддержки текущей версии Node.js
        },
      },
    ],
    '@babel/preset-typescript', // Пресет для поддержки TypeScript
  ],
  plugins: [
    [
      'module-resolver', // Плагин для поддержки алиасов
      {
        alias: {
          '@': './src', // Алиас для папки src
        },
      },
    ],
  ],
};