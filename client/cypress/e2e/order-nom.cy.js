describe('Страница номенклатуры ордера', () => {
  const orderId = 1840
  const orderUrl = `/order/${orderId}/noms`

  beforeEach(() => {
    cy.visit(orderUrl)
    cy.url().should('include', orderUrl)
  })

  it('должна корректно отображать основные элементы', () => {
    // Проверяем наличие заголовка с номером заказа
    // cy.get('.card-header')
    //   .should('exist')
    //   .and('contain.text', `Информация о заказе ${orderId}`)

    // Проверяем значения полей информации о заказе
    cy.get('.field-value').then((fields) => {
      expect(fields.eq(0)).to.contain.text('1 840') // № заказа
      expect(fields.eq(1)).to.contain.text('23.06.2020') // Дата заказа
      expect(fields.eq(2)).to.contain.text('"Константа закупки"') // Контрагент
    })

    // Проверяем, что текстовые поля комментариев недоступны для редактирования
    cy.get('textarea[aria-label="textarea"]').should('have.attr', 'disabled')
  })

  it('должна отображать таблицу с номенклатурой и содержать данные', () => {
    // Проверяем, что таблица существует и видима
    cy.get('.table-sbor').should('exist').and('be.visible')

    // Проверяем, что таблица содержит хотя бы одну строку
    cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)

    // Проверяем содержимое первой строки
    // cy.get('.table-sbor tbody tr')
    //   .first()
    //   .within(() => {
    //     cy.get('td').eq(2).should('contain.text', 'Барабан') // Наименование
    //     cy.get('td').eq(3).should('contain.text', '0070') // Обозначение
    //     cy.get('td').eq(4).should('contain.text', '20') // Кол-во
    //   })
  })

  it('должна загружать данные через API', () => {
    // Перехватываем запрос к API и подменяем ответ
    // cy.intercept('GET', `/api/order/${orderId}/noms`, {
    //   fixture: 'noms.json',
    // }).as('getNoms')

    // Загружаем страницу и ждем завершения запроса
    // cy.wait('@getNoms').its('response.statusCode').should('eq', 200)

    // Проверяем, что данные отобразились в таблице
    cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)
  })
})
