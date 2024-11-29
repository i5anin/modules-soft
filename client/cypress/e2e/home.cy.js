describe('Список маршрутов', () => {
  it('открывается и отображает заголовок', () => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.get('h4').should('contain.text', 'Список маршрутов')
  })

  it('отображает таблицу с маршрутами', () => {
    // Проверяем, что таблица с классом table-bordered существует
    cy.get('table.table-bordered', { timeout: 20000 }).should('exist')

    // Убедимся, что таблица содержит хотя бы одну строку
    cy.get('table tbody tr', { timeout: 20000 }).should(
      'have.length.greaterThan',
      0
    )

    // Проверяем содержимое первой строки
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('not.be.empty') // Название маршрута
        cy.get('td').eq(1).should('not.be.empty') // Путь
      })
  })

  it('генерирует корректные ссылки для маршрутов', () => {
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td')
          .eq(3)
          .find('a')
          .should('have.attr', 'href')
          .and('include', '/') // Проверяем, что ссылка корректна
      })
  })
})
