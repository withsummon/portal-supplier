'use client'

import {
  Activity,
  AlertCircle,
  Clock,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Users,
} from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

const STATS: StatCard[] = [
  {
    title: 'Total Sellers',
    value: '128',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    iconBg: 'var(--blue-50)',
    iconColor: 'var(--blue-600)',
  },
  {
    title: 'Total Vendors',
    value: '85',
    change: '+8%',
    changeType: 'positive',
    icon: Users,
    iconBg: 'var(--color-success-bg)',
    iconColor: 'var(--color-success)',
  },
  {
    title: 'Active Projects',
    value: '45',
    change: '+8%',
    changeType: 'positive',
    icon: FolderOpen,
    iconBg: 'var(--color-success-bg)',
    iconColor: 'var(--color-success)',
  },
  {
    title: 'Total Pendapatan',
    value: 'Rp 4,5M',
    change: '+23%',
    changeType: 'positive',
    icon: DollarSign,
    iconBg: 'var(--color-purple-bg)',
    iconColor: 'var(--color-purple)',
  },
  {
    title: 'Conversion Rate',
    value: '34%',
    change: '-2%',
    changeType: 'negative',
    icon: TrendingUp,
    iconBg: 'var(--color-warning-bg)',
    iconColor: 'var(--color-warning)',
  },
]

const RECENT_ACTIVITIES = [
  {
    id: 1,
    action: 'Seller baru terdaftar',
    supplier: 'Sarah Mitchell',
    time: '2 menit lalu',
    type: 'supplier',
  },
  {
    id: 2,
    action: 'Vendor baru terdaftar',
    supplier: 'PT Arya Teknologi',
    time: '15 menit lalu',
    type: 'supplier',
  },
  {
    id: 3,
    action: 'Project disubmit',
    supplier: 'Digital Solusi',
    time: '1 jam lalu',
    type: 'project',
  },
  {
    id: 4,
    action: 'Project disetujui',
    supplier: 'Tech Indonesia',
    time: '2 jam lalu',
    type: 'project',
  },
  {
    id: 5,
    action: 'Pembayaran diterima',
    supplier: 'PT Cahaya Digital',
    time: '3 jam lalu',
    type: 'payment',
  },
]

const PENDING_ACTIONS = [
  { id: 1, title: 'Review aplikasi seller', count: 3, priority: 'high' },
  { id: 2, title: 'Review aplikasi vendor', count: 5, priority: 'high' },
  { id: 3, title: 'Review project', count: 8, priority: 'medium' },
  { id: 4, title: 'Permintaan klarifikasi', count: 2, priority: 'low' },
]

export default function AdminDashboard() {
  return (
    <div className="animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Ringkasan kinerja dan aktivitas platform.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <button className="btn btn-secondary">Export Laporan</button>
          <button className="btn btn-primary">Lihat Analytics</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card" style={{ padding: 'var(--sp-5)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    background: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} style={{ color: stat.iconColor }} />
                </div>
                <span
                  style={{
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-semibold)',
                    color:
                      stat.changeType === 'positive'
                        ? 'var(--color-success)'
                        : stat.changeType === 'negative'
                          ? 'var(--color-danger)'
                          : 'var(--text-muted)',
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div
                style={{
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 'var(--fw-bold)',
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                {stat.title}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
        {/* Recent Activity */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <h3
            style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            Aktivitas Terkini
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {RECENT_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--neutral-50)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background:
                      activity.type === 'supplier'
                        ? 'var(--blue-50)'
                        : activity.type === 'project'
                          ? 'var(--color-success-bg)'
                          : 'var(--color-purple-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {activity.type === 'supplier' ? (
                    <Users size={18} style={{ color: 'var(--blue-600)' }} />
                  ) : activity.type === 'project' ? (
                    <FolderOpen size={18} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <DollarSign size={18} style={{ color: 'var(--color-purple)' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 'var(--fs-sm)',
                      fontWeight: 'var(--fw-medium)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {activity.action}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    {activity.supplier}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <h3
            style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            Tindakan Tertunda
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {PENDING_ACTIONS.map((action) => (
              <div
                key={action.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--sp-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  {action.priority === 'high' ? (
                    <AlertCircle size={20} style={{ color: 'var(--color-danger)' }} />
                  ) : action.priority === 'medium' ? (
                    <Clock size={20} style={{ color: 'var(--color-warning)' }} />
                  ) : (
                    <Activity size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                    {action.title}
                  </span>
                </div>
                <span
                  style={{
                    background:
                      action.priority === 'high'
                        ? 'var(--color-danger-bg)'
                        : action.priority === 'medium'
                          ? 'var(--color-warning-bg)'
                          : 'var(--neutral-100)',
                    color:
                      action.priority === 'high'
                        ? 'var(--color-danger)'
                        : action.priority === 'medium'
                          ? 'var(--color-warning)'
                          : 'var(--text-muted)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-bold)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {action.count}
                </span>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--sp-4)' }}>
            Lihat Semua
          </button>
        </div>
      </div>
    </div>
  )
}
