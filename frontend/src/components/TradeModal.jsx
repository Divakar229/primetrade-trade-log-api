import { useState } from 'react'

const SYMBOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT', 'AVAX/USDT', 'ADA/USDT']

export default function TradeModal({ trade, onSave, onClose }) {
  const isEdit = !!trade
  const [form, setForm] = useState({
    symbol: trade?.symbol || 'BTC/USDT',
    trade_type: trade?.trade_type || 'buy',
    quantity: trade?.quantity || '',
    entry_price: trade?.entry_price || '',
    exit_price: trade?.exit_price || '',
    status: trade?.status || 'open',
    notes: trade?.notes || '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        quantity: parseFloat(form.quantity),
        entry_price: parseFloat(form.entry_price),
        exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) setError(detail.map(d => d.msg).join(', '))
      else setError(detail || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: 16
      }}
    >
      <div style={{
        background: 'white', borderRadius: 12, padding: 28,
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#1a1a2e' }}>{isEdit ? 'Edit Trade' : 'Log New Trade'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label>Symbol</label>
              <select value={form.symbol} onChange={set('symbol')}>
                {SYMBOLS.map(s => <option key={s}>{s}</option>)}
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.trade_type} onChange={set('trade_type')}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" step="any" min="0" placeholder="0.00" value={form.quantity} onChange={set('quantity')} required />
            </div>
            <div className="form-group">
              <label>Entry Price (USDT)</label>
              <input type="number" step="any" min="0" placeholder="0.00" value={form.entry_price} onChange={set('entry_price')} required />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label>Exit Price (optional)</label>
              <input type="number" step="any" min="0" placeholder="0.00" value={form.exit_price} onChange={set('exit_price')} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="Strategy, rationale…"
              value={form.notes}
              onChange={set('notes')}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', minHeight: 72, outline: 'none' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '9px 20px', border: '1px solid #ddd', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: 'auto', marginTop: 0 }}
            >
              {loading ? 'Saving...' : isEdit ? 'Update Trade' : 'Log Trade'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}