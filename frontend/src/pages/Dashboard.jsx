import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { tradesAPI } from '../api/client'

function Dashboard() {
  const { user, logout } = useAuth()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [symbol, setSymbol] = useState('BTC/USDT')
  const [tradeType, setTradeType] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => { loadTrades() }, [])

  async function loadTrades() {
    setLoading(true)
    try {
      const res = await tradesAPI.list()
      setTrades(res.data)
    } catch (err) {}
    setLoading(false)
  }

  async function handleCreateTrade(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    try {
      await tradesAPI.create({
        symbol,
        trade_type: tradeType,
        quantity: parseFloat(quantity),
        entry_price: parseFloat(entryPrice),
        exit_price: exitPrice ? parseFloat(exitPrice) : null,
        notes,
        status: 'open'
      })
      setFormSuccess('Trade logged successfully!')
      setQuantity('')
      setEntryPrice('')
      setExitPrice('')
      setNotes('')
      loadTrades()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create trade')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this trade?')) return
    try {
      await tradesAPI.delete(id)
      loadTrades()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5' }}>▲ PrimeTrade.AI</span>
          <span style={{ marginLeft: 16, color: '#555' }}>Welcome, <strong>{user?.username}</strong></span>
          <span className="role-badge">{user?.role}</span>
        </div>
        <button className="btn btn-logout" onClick={() => { logout(); window.location.href = '/login' }}>
          Logout
        </button>
      </div>

      {/* Create Trade */}
      <div className="card">
        <h3>📊 Log New Trade</h3>
        {formError && <div className="error-msg">{formError}</div>}
        {formSuccess && <div className="success-msg">{formSuccess}</div>}

        <form onSubmit={handleCreateTrade} className="trade-form">
          <div className="form-group">
            <label>Symbol</label>
            <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>SOL/USDT</option>
              <option>BNB/USDT</option>
              <option>XRP/USDT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={{ width: 100 }} />
          </div>

          <div className="form-group">
            <label>Entry Price</label>
            <input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} required style={{ width: 120 }} />
          </div>

          <div className="form-group">
            <label>Exit Price (optional)</label>
            <input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} style={{ width: 120 }} />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: 150 }} />
          </div>

          <button type="submit" className="btn-add">+ Add Trade</button>
        </form>
      </div>

      {/* Trades Table */}
      <div className="card">
        <h3>📋 My Trades ({trades.length})</h3>

        {loading && <p>Loading...</p>}

        {!loading && trades.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>No trades yet. Add your first trade above!</p>
        )}

        {!loading && trades.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Entry Price</th>
                <th>Exit Price</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td><strong>{trade.symbol}</strong></td>
                  <td><span className={`badge badge-${trade.trade_type}`}>{trade.trade_type}</span></td>
                  <td>{trade.quantity}</td>
                  <td>${trade.entry_price.toLocaleString()}</td>
                  <td>{trade.exit_price ? `$${trade.exit_price.toLocaleString()}` : '-'}</td>
                  <td><span className={`badge badge-${trade.status}`}>{trade.status}</span></td>
                  <td>{trade.notes || '-'}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(trade.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

export default Dashboard