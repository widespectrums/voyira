import BaseRepository from "../../../core/base/base.repository.js";
import { Sequelize } from "sequelize";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Product from "../../product/models/product.model.js";
import ShippingMethod from "../models/shippingMethod.model.js";
import Color from "../../product/models/color.model.js";
import Size from "../../product/models/size.model.js";

export default class CartRepository extends BaseRepository {
    constructor() {
        super(Cart);
    }

    findActiveCartByUserId = async (userId, options = {}) => {
        if (!userId) {
            console.error("findActiveCartByUserId: userId parametresi undefined veya null!");
            return null;
        }

        return this.model.findOne({
            where: {
                user_id: userId,
                status: 'active'
            },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'price', 'stock', 'slug']
                        },
                        {
                            model: Color,
                            as: 'color',
                            attributes: ['id', 'name']
                        },
                        {
                            model: Size,
                            as: 'size',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: ShippingMethod,
                    as: 'shippingMethod',
                    attributes: ['id', 'name', 'base_fee', 'free_shipping_threshold']
                }
            ],
            ...options
        });
    };

    updateCartTotals = async (cartId, transaction) => {
        // First, get all cart items
        const cartItems = await CartItem.findAll({
            where: { cart_id: cartId },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'items_total'],
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'items_count']
            ],
            raw: true,
            transaction
        });

        // Get the cart with shipping method
        const cart = await this.findById(cartId, {
            include: [
                {
                    model: ShippingMethod,
                    as: 'shippingMethod'
                }
            ],
            transaction
        });

        let itemsTotal = cartItems[0].items_total || 0;
        let itemsCount = cartItems[0].items_count || 0;

        // Calculate shipping fee based on shipping method rules
        let shippingFee = 0;
        if (cart.shippingMethod) {
            if (cart.shippingMethod.free_shipping_threshold &&
                itemsTotal >= cart.shippingMethod.free_shipping_threshold) {
                shippingFee = 0;
            } else {
                shippingFee = cart.shippingMethod.base_fee;
            }
        }

        // Update cart totals
        return this.update(
            cartId,
            {
                total_items: itemsCount,
                total_price: parseFloat(itemsTotal) + parseFloat(shippingFee),
                shipping_fee: shippingFee,
                last_activity: new Date()
            },
            { transaction }
        );
    };

    setShippingMethod = async (cartId, shippingMethodId, transaction) => {
        return this.update(
            cartId,
            {
                shipping_method_id: shippingMethodId,
                last_activity: new Date()
            },
            { transaction }
        );
    };

    completeCart = async (cartId, transaction) => {
        return this.update(
            cartId,
            {
                status: 'completed',
                last_activity: new Date()
            },
            { transaction }
        );
    };

    abandonCart = async (cartId, transaction) => {
        return this.update(
            cartId,
            {
                status: 'abandoned',
                last_activity: new Date()
            },
            { transaction }
        );
    };
}