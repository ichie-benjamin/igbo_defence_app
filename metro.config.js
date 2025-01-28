// Learn more https://docs.expo.io/guides/customizing-metro

// const { getDefaultConfig } = require('expo/metro-config');
//
// module.exports = getDefaultConfig(__dirname);

// const { getDefaultConfig } = require('expo/metro-config');

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname, { env: 'development' });

//   if (defaultConfig.resolver.platforms) {
//     defaultConfig.resolver.platforms.push('windows');
//   }

//   return defaultConfig;
// })();


const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;
