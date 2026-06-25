// Metro config for the pnpm monorepo. Expo's default config plus the two
// settings Metro needs to resolve the hoisted workspace packages
// (@<slug>/app, @<slug>/ui) from apps/native:
//   1. watch the workspace root so edits in packages/* trigger reloads
//   2. let Metro fall back to the root node_modules created by node-linker=hoisted
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

module.exports = config
