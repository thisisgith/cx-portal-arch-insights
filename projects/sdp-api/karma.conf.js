const karmaConfig = require('@apollo/configs/karma');
const path = require('path');

module.exports = config => karmaConfig(config, path.join(__dirname, '../../../coverage/sdp'));
