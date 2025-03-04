import React from 'react';
import Marquee from 'react-fast-marquee';

const FlashDiscounts = () => {
    return (
        <div className="bg-black text-white p-2 my-2">
            <div className="container">
                <Marquee speed={80}>
                    🚨 FLASH İNDİRİMLER! 🚨 FLASH İNDİRİMLER! 🚨 Hemen alışverişe başla, fırsatları kaçırma! 🚨Hemen alışverişe başla, fırsatları kaçırma!
                </Marquee>
            </div>
        </div>
    );
};

export default FlashDiscounts;