import BaseService from "../services/base/base.service.js";
import  sequelize  from "../config/database.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/api.error.js";

export default class CartService extends BaseService {
    constructor(cartRepository, cartItemRepository, productService) {
        super(cartRepository);
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    getUserCart = async (userId) => {
        try {
            console.log(`Looking for active cart for user: ${userId}`);
            let cart = await this.repository.findActiveCartByUserId(userId);
            console.log(`Cart found: ${cart ? 'Yes' : 'No'}`);

            // If no active cart exists, create a new one
            if (!cart) {
                console.log('Creating new cart for user');
                cart = await this.createCart(userId);
            }

            return cart;
        } catch (error) {
            console.error('Error in getUserCart:', error);
            throw error;
        }
    };

    createCart = async (userId) => {
        try {
            console.log(`Creating cart for user: ${userId}`);
            const cart = await this.repository.create({
                user_id: userId,
                status: 'active',
                last_activity: new Date()
            });
            console.log(`Cart created with ID: ${cart.id}`);
            return cart;
        } catch (error) {
            console.error('Error in createCart:', error);
            throw error;
        }
    };

    addItemToCart = async (userId, productId, quantity, colorId = null, sizeId = null) => {
        if (quantity <= 0) {
            throw new BadRequestError("Quantity must be greater than zero");
        }

        try {
            // Ürünün varlığını kontrol et
            console.log(`Checking product: ${productId}`);
            await this.productService.getById(productId);
            console.log('Product details retrieved:', productId);

            // Varyasyon kontrollerini cartItemRepository içinde yapacağız
            return await sequelize.transaction(async (transaction) => {
                // Get or create active cart
                console.log(`Finding active cart for user: ${userId}`);
                let cart = await this.repository.findActiveCartByUserId(userId, { transaction });
                console.log(`Active cart found: ${cart ? 'Yes with ID ' + cart.id : 'No'}`);

                if (!cart) {
                    console.log('Creating new cart');
                    cart = await this.repository.create({
                        user_id: userId,
                        status: 'active',
                        last_activity: new Date()
                    }, { transaction });
                    console.log(`New cart created with ID: ${cart.id}`);
                }

                // Add item to cart with variant information
                console.log(`Adding item to cart: ${productId}, quantity: ${quantity}`);
                await this.cartItemRepository.addToCart(
                    cart.id,
                    productId,
                    quantity,
                    colorId,
                    sizeId,
                    transaction
                );
                console.log('Item added to cart');

                // Update cart totals
                console.log(`Updating cart totals for cart: ${cart.id}`);
                await this.repository.updateCartTotals(cart.id, transaction);
                console.log('Cart totals updated');

                // Return updated cart
                console.log('Retrieving updated cart');
                return await this.repository.findActiveCartByUserId(userId, { transaction });
            });
        } catch (error) {
            console.error('Error in addItemToCart:', error);
            throw error;
        }
    };

    // Rest of your methods remain the same...
    updateItemQuantity = async (userId, itemId, quantity) => {
        if (quantity <= 0) {
            throw new BadRequestError("Quantity must be greater than zero");
        }

        return await sequelize.transaction(async (transaction) => {
            // Get active cart
            const cart = await this.repository.findActiveCartByUserId(userId, { transaction });
            if (!cart) {
                throw new NotFoundError("Cart not found");
            }

            // Find cart item
            const cartItem = await this.cartItemRepository.findById(itemId, { transaction });
            if (!cartItem || cartItem.cart_id !== cart.id) {
                throw new NotFoundError("Cart item not found");
            }

            // Check product stock
            const product = await this.productService.getById(cartItem.product_id);
            if (product.stock < quantity) {
                throw new BadRequestError("Not enough stock available");
            }

            // Update item quantity
            await this.cartItemRepository.updateQuantity(itemId, quantity, transaction);

            // Update cart totals
            await this.repository.updateCartTotals(cart.id, transaction);

            // Return updated cart
            return await this.repository.findActiveCartByUserId(userId, { transaction });
        });
    };

    removeItemFromCart = async (userId, productId) => {
        return await sequelize.transaction(async (transaction) => {
            // Get active cart
            const cart = await this.repository.findActiveCartByUserId(userId, { transaction });
            if (!cart) {
                throw new NotFoundError("Cart not found");
            }

            // Remove item from cart
            await this.cartItemRepository.deleteByCartIdAndProductId(cart.id, productId, transaction);

            // Update cart totals
            await this.repository.updateCartTotals(cart.id, transaction);

            // Return updated cart
            return await this.repository.findActiveCartByUserId(userId, { transaction });
        });
    };

    clearCart = async (userId) => {
        return await sequelize.transaction(async (transaction) => {
            // Get active cart
            const cart = await this.repository.findActiveCartByUserId(userId, { transaction });
            if (!cart) {
                throw new NotFoundError("Cart not found");
            }

            // Remove all items from cart
            await this.cartItemRepository.deleteAllByCartId(cart.id, transaction);

            // Update cart totals
            await this.repository.updateCartTotals(cart.id, transaction);

            // Return updated cart
            return await this.repository.findActiveCartByUserId(userId, { transaction });
        });
    };

    setShippingMethod = async (userId, shippingMethodId) => {
        return await sequelize.transaction(async (transaction) => {
            // Get active cart
            const cart = await this.repository.findActiveCartByUserId(userId, { transaction });
            if (!cart) {
                throw new NotFoundError("Cart not found");
            }

            // Set shipping method
            await this.repository.setShippingMethod(cart.id, shippingMethodId, transaction);

            // Update cart totals with new shipping method
            await this.repository.updateCartTotals(cart.id, transaction);

            // Return updated cart
            return await this.repository.findActiveCartByUserId(userId, { transaction });
        });
    };

    completeCart = async (userId) => {
        return await sequelize.transaction(async (transaction) => {
            // Get active cart
            const cart = await this.repository.findActiveCartByUserId(userId, { transaction });
            if (!cart) {
                throw new NotFoundError("Cart not found");
            }

            if (cart.total_items === 0) {
                throw new BadRequestError("Cannot complete an empty cart");
            }

            // Mark cart as completed
            await this.repository.completeCart(cart.id, transaction);

            // Return completed cart
            return await this.repository.findById(cart.id, { transaction });
        });
    };
}