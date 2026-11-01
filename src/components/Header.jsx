import { NavLink } from 'react-router'
import { useCart } from '../hooks/useCart.js'

function Header() {
  const { count: cartCount } = useCart()

  return (
    <header className="header">
      <h1 className="logo">CampusEats</h1>

      <nav className="nav">
        <NavLink to="/" end className="link">
          Vendors
        </NavLink>

        <NavLink to="/cart" className="link cart">
          Cart <span className="badge">{cartCount}</span>
        </NavLink>

        <NavLink to="/orders" className="link">
          Orders
        </NavLink>
      </nav>
    </header>
  )
}

export default Header