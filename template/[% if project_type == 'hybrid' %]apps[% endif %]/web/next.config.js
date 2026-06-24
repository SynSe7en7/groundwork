const { withTamagui } = require('@tamagui/next-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tamagui and the shared workspace packages ship untranspiled source, so
  // Next.js must compile them. Add any extra Tamagui sub-package you import
  // here if Metro-style "Cannot use import statement outside a module" errors
  // appear.
  transpilePackages: [
    'react-native',
    'react-native-web',
    'solito',
    'tamagui',
    '@tamagui/core',
    '@tamagui/next-plugin',
  ],
}

const tamaguiPlugin = withTamagui({
  config: '../../packages/ui/tamagui.config.ts',
  components: ['tamagui', '@PROJECT_SLUG_PLACEHOLDER/ui'],
  outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
})

module.exports = function () {
  return {
    ...nextConfig,
    ...tamaguiPlugin(nextConfig),
  }
}
