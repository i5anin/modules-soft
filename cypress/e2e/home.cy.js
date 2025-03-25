describe('Список маршрутов', () => {
  it('открывается и отображает заголовок', () => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.get('h4').should('contain.text', 'Список маршрутов')
  })

  it('таблица маршрутов отображается', () => {
    cy.visit('/')

    // Убедитесь, что таблица отобразилась
    cy.get('table', { timeout: 1000 }).should('exist').and('be.visible')
  })
})
