/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const dotenvLoad = require('dotenv-load')

const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withNextEnv = require('next-env')()
const withFonts = require('next-fonts')

dotenvLoad()

module.exports = withPlugins([withNextEnv, withFonts, withImages], {
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60,
  },
  webpack(config, options) {
    config.node = {
      fs: 'empty',
    }
    config.resolve.alias['~'] = path.join(__dirname, 'src')
    return config
  },
})
