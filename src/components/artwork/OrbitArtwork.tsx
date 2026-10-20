const columns = [
  {
    title: 'В планах',
    color: 'purple',
    cards: ['Исследовать идею', 'Собрать референсы'],
  },
  {
    title: 'В процессе',
    color: 'yellow',
    cards: ['Создать что-то новое', 'Найти свою форму'],
  },
  {
    title: 'Готово',
    color: 'green',
    cards: ['Сделать первый шаг'],
  },
]

export function OrbitArtwork() {
  return (
    <div className="project-art orbit-art" aria-hidden="true">
      <div className="orbit-window">
        <div className="orbit-top">
          <b><span>✳</span> orbit</b>
          <span>Workspace <span className="orbit-avatar">O</span></span>
        </div>
        <div className="orbit-heading">Большие идеи.<span>Маленькие шаги.</span></div>

        <div className="orbit-board">
          {columns.map(column => (
            <div className="board-column" key={column.title}>
              <div className="column-title">
                <i className={column.color} />
                {column.title}
                <span>{column.cards.length}</span>
              </div>

              {column.cards.map((card, index) => (
                <div className="board-card" key={card}>
                  <span className={`board-tag ${column.color}`}>{index ? 'Design' : 'Product'}</span>
                  <b>{card}</b>
                  <div className="board-lines"><i /><i /></div>
                  <div className="board-card-footer"><span>◷ 24 окт</span><i /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
