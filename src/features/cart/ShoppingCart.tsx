
import {
  addItem,
  removeItem,
  updateQty,
  clearCart,
} from "./cartSlice";

import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from "./cartSelectors";

import type { Product } from "./cartTypes";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

const products: Product[] = [
  { id: 1, name: "Laptop", price: 55000 },
  { id: 2, name: "Mouse", price: 799 },
  { id: 3, name: "Keyboard", price: 1499 },
  { id: 4, name: "Monitor", price: 12000 },
];

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function ShoppingCart() {
  const dispatch = useAppDispatch();

  // Read Redux state
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  return (
    <div style={styles.container}>
      <h1>Shopping Cart</h1>

      {/* Product Listing */}
      <section>
        <h2>Products</h2>

        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <h3>{product.name}</h3>

              <p>{currency(product.price)}</p>

              <button
                onClick={() => dispatch(addItem(product))}
                style={styles.addButton}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Shopping Cart */}
      <section style={styles.cart}>
        <div style={styles.header}>
          <h2>Shopping Cart ({itemCount})</h2>

          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              style={styles.removeButton}
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    <td>{currency(item.price)}</td>

                    <td>
                      <button
                        disabled={item.qty <= 1}
                        onClick={() =>
                          dispatch(
                            updateQty({
                              id: item.id,
                              qty: item.qty - 1,
                            })
                          )
                        }
                      >
                        -
                      </button>

                      <span style={{ margin: "0 12px" }}>
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateQty({
                              id: item.id,
                              qty: item.qty + 1,
                            })
                          )
                        }
                      >
                        +
                      </button>
                    </td>

                    <td>
                      {currency(item.price * item.qty)}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          dispatch(removeItem(item.id))
                        }
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={styles.total}>
              Total: {currency(total)}
            </h2>
          </>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1000,
    margin: "30px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 15,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
  },
  addButton: {
    background: "#2563eb",
    color: "white",
    border: 0,
    padding: "9px 14px",
    borderRadius: 5,
    cursor: "pointer",
  },
  cart: {
    marginTop: 35,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  removeButton: {
    background: "#dc2626",
    color: "white",
    border: 0,
    padding: "7px 12px",
    borderRadius: 5,
    cursor: "pointer",
  },
  total: {
    textAlign: "right",
    marginTop: 20,
  },
};
