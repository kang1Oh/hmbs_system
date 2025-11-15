import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.tool_id === item.tool_id);
      if (existing) {
        return prev.map((i) =>
          i.tool_id === item.tool_id
            ? { ...i, selectedQty: i.selectedQty + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          tool_id: item.tool_id,
          selectedQty: quantity,
        },
      ];
    });
  };

  const removeFromCart = (tool_id) => {
    setCart((prev) => prev.filter((item) => item.tool_id !== tool_id));
  };

  const updateQuantity = (tool_id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.tool_id === tool_id ? { ...item, selectedQty: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.selectedQty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
