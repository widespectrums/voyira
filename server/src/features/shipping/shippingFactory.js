import DefaultShippingProvider from "./defaultShippingProvider.js";
// Import future providers here

/**
 * Factory for creating shipping provider instances
 */
export default class ShippingProviderFactory {
    /**
     * Get a shipping provider instance by provider code
     * @param {string} providerCode - Provider code from the database
     * @param {Object} dependencies - Dependencies needed by providers
     * @returns {ShippingProviderInterface} - Shipping provider instance
     */
    static getProvider(providerCode, dependencies = {}) {
        const { shippingMethodRepository } = dependencies;

        switch (providerCode) {
            case 'default':
            case null:
            case undefined:
                return new DefaultShippingProvider(shippingMethodRepository);
            // Add future providers here
            // case 'ups':
            //     return new UPSShippingProvider(config);
            // case 'fedex':
            //     return new FedExShippingProvider(config);
            default:
                console.warn(`Unknown shipping provider: ${providerCode}. Using default.`);
                return new DefaultShippingProvider(shippingMethodRepository);
        }
    }
}