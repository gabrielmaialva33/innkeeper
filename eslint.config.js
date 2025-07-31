import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  ignores: ['tmp/**', 'build/**', 'node_modules/**', '.DS_Store', 'coverage/**'],
})
