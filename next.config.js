/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const dotenvLoad = require('dotenv-load')

const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withNextEnv = require('next-env')()
const withFonts = require('next-fonts')

dotenvLoad()

module.exports = withPlugins([withNextEnv, withFonts, withImages], {
  experimental: {
    reactRefresh: true,
  },
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60,
  },
  webpack(config, options) {
    const { dir } = options
    config.node = {
      fs: 'empty',
    }
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [dir],
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader',
        },
      ],
    })
    config.resolve.alias['~'] = path.join(__dirname, 'src')
    return config
  },
})
