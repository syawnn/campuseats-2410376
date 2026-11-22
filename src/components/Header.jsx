import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useCart } from '../hooks/useCart.js'
import { useAuth } from '../hooks/useAuth.js'
import { authErrorMessage } from '../authErrors.js'

function Header() {
  const { count: cartCount, clearCart } = useCart()
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleLogout() {
    setError('')

    try {
      await logout()
      clearCart()
      navigate('/', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    }
  }

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

        {!loading && (
          user ? (
            <>
              <span>Hello, {user.displayName || user.email}</span>
              <button
                type="button"
                className="btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="link">
              Log in
            </NavLink>
          )
        )}
      </nav>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </header>
  )
}

export default Header