// Source - https://stackoverflow.com/a
// Posted by CodeMarkey
// Retrieved 2026-01-26, License - CC BY-SA 4.0

module.exports = {
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);

            config.client = {
                overlay: false,
            };

            return config;
        };
    },
};
