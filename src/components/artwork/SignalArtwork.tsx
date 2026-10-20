export function SignalArtwork() {
  return (
    <div className="project-art signal-art" aria-hidden="true">
      <div className="signal-window">
        <aside className="signal-sidebar">
          <span className="signal-logo">s<span>·</span></span>
          <i />
          <i />
          <i />
          <i />
          <i />
        </aside>
        <div className="signal-content">
          <div className="mock-topbar">
            <span>Обзор пространства</span>
            <span className="mock-avatar">S</span>
          </div>
          <div className="mock-greeting">Всё под контролем<span>Обзор активности за этот месяц</span></div>
          <div className="metric-row">
            <div>
              <small>Просмотры</small>
              <b>24,890 <em>↗ 12.8%</em></b>
            </div>
            <div>
              <small>Вовлечённость</small>
              <b>68.4% <em>↗ 8.2%</em></b>
            </div>
          </div>
          <div className="mock-chart-head">
            <b>Активность</b>
            <span>Этот месяц⌄</span>
          </div>
          <svg viewBox="0 0 400 115" className="mock-chart">
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#aaa5d4" stopOpacity=".5" />
                <stop offset="1" stopColor="#aaa5d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 20H400M0 55H400M0 90H400" stroke="#e8e6ef" strokeDasharray="4 4" fill="none" />
            <path
              d="M0 100C24 100 24 73 48 77S72 94 96 69S120 83 144 50S168 63 192 48S216 71 240 35S264 55 288 26S312 47 336 14S368 25 400 5V115H0Z"
              fill="url(#chart-fill)"
            />
            <path
              d="M0 100C24 100 24 73 48 77S72 94 96 69S120 83 144 50S168 63 192 48S216 71 240 35S264 55 288 26S312 47 336 14S368 25 400 5"
              stroke="#8e85bb"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
          <div className="mock-axis">
            <span>01 июн</span>
            <span>10 июн</span>
            <span>20 июн</span>
            <span>30 июн</span>
          </div>
        </div>
      </div>
    </div>
  )
}
