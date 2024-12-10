describe('Страница номенклатуры ордера с разными ролями', () => {
  const orderId = 1840
  const orderUrl = `/order/${orderId}/noms`
  const roles = ['managers', 'metrolog', 'omts', 'tech_calc']

  roles.forEach((role) => {
    it(`должна корректно загружаться для роли "${role}"`, () => {
      // Устанавливаем значение в localStorage
      cy.visit(orderUrl, {
        onBeforeLoad(win) {
          win.localStorage.setItem('selectedRole', role)
        },
      })

      // Проверяем, что страница загрузилась
      cy.url().should('include', orderUrl)

      // Проверяем, что значение из localStorage установлено правильно
      cy.window().then((win) => {
        expect(win.localStorage.getItem('selectedRole')).to.eq(role)
      })

      // Проверяем, что таблица с данными отображается
      cy.get('.table-sbor').should('exist').and('be.visible')
      cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)

      // Дополнительные проверки для каждого значения роли можно добавить здесь
    })
  })
})
