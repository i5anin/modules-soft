describe('Страница номенклатуры kp с разными ролями', () => {
  const kpId = 13955 // Идентификатор ордера для формирования URL страницы
  const kpUrl = `/commercial/${kpId}/noms` // URL страницы номенклатуры
  const roles = ['managers', 'metrolog', 'omts'] // Список ролей для проверки

  roles.forEach((role) => {
    it(`должна корректно загружаться для роли "${role}"`, () => {
      // Устанавливаем выбранную роль в localStorage перед загрузкой страницы
      cy.visit(kpUrl, {
        onBeforeLoad(win) {
          win.localStorage.setItem('selectedRole', role)
        },
      })

      // Проверяем, что URL страницы содержит идентификатор ордера и корректный путь
      cy.url().should('include', kpUrl)

      // Убеждаемся, что значение роли правильно установлено в localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('selectedRole')).to.eq(role)
      })

      // Небольшая задержка перед проверкой таблицы
      cy.wait(4000)

      // Проверяем, что таблица с данными отображается на странице
      cy.get('.table-sbor')
        .should('exist') // Убедимся, что таблица существует в DOM
        .and('be.visible') // Убедимся, что таблица видима пользователю

      // Проверяем, что таблица содержит хотя бы одну строку с данными
      cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)

      // Здесь можно добавить дополнительные проверки для специфических ролей
      // Например, проверка доступных кнопок или других элементов интерфейса
    })
  })
})
