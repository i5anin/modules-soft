describe('Страница номенклатуры ордера', () => {
  it('должна корректно загружаться и отображать основные элементы', () => {
    // Заходим на страницу
    cy.visit('/order/1840/noms')

    // Проверяем URL
    cy.url().should('include', '/order/1840/noms')

    // Проверяем наличие заголовка "Информация о заказе"
    cy.get('.card-header').should('contain.text', 'Информация о заказе 1840')

    // Проверяем информацию о заказе
    cy.get('.field-value').then((fields) => {
      expect(fields.eq(0)).to.contain.text('1840') // № заказа
      expect(fields.eq(1)).to.contain.text('23.06.2020') // Дата заказа
      expect(fields.eq(2)).to.contain.text('"Константа закупки"') // Контрагент
    })

    // Проверяем, что комментарии присутствуют
    cy.get('textarea[aria-label="textarea"]').each((textarea) => {
      cy.wrap(textarea).should('have.attr', 'disabled')
    })
  })

  it('таблица с номенклатурой отображается и содержит данные', () => {
    // Проверяем, что таблица видима
    cy.get('.table-sbor').should('exist').and('be.visible')

    // Проверяем, что таблица содержит хотя бы одну строку
    cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)

    // Проверяем содержимое первой строки
    cy.get('.table-sbor tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(2).should('contain.text', 'Барабан') // Наименование
        cy.get('td').eq(3).should('contain.text', '0070') // Обозначение
        cy.get('td').eq(4).should('contain.text', '20') // Кол-во
      })
  })

  it('должен загружать данные через API', () => {
    // Перехватываем запрос на данные таблицы
    cy.intercept('GET', '/api/order/1840/noms', { fixture: 'noms.json' }).as(
      'getNoms'
    )

    // Загружаем страницу
    cy.visit('/order/1840/noms')

    // Ждем завершения запроса
    cy.wait('@getNoms').its('response.statusCode').should('eq', 200)

    // Проверяем, что таблица отобразила данные из API
    cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)
  })
})
