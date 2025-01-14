module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest', // Обработка .vue файлов
    '^.+\\.js$': 'babel-jest', // Обработка JavaScript с помощью Babel
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Поддержка алиасов
  },
  testEnvironment: 'jsdom', // Для тестирования в браузерной среде
  testMatch: ['**/tests/**/*.spec.js'], // Где искать тесты
  transformIgnorePatterns: [
    // Исключение node_modules, кроме тех, которые нужно преобразовывать
    '/node_modules/(?!(axios)/)',
  ],
};