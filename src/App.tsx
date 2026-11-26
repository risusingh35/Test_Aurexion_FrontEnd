
import UserTable from "./component/table";
import ShoppingCart from "./features/cart/ShoppingCart";

export default function App() {
  return (
    <main>
      <ShoppingCart />

      <hr />

      <h2>User Management</h2>
      <UserTable />
    </main>
  );
}
