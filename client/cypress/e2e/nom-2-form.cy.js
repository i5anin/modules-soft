describe('Проверка страниц номенклатуры для разных ролей', () => {
  const paths = [
    {
      path: '/order/:id/noms',
      idKey: 'id',
      idValue: 1840,
      roles: ['managers', 'metrolog', 'omts', 'tech_calc'],
    },
    {
      path: '/commercial/:id/noms',
      idKey: 'id',
      idValue: 13955,
      roles: ['managers', 'metrolog', 'omts'],
    },
    {
      path: '/specifications/:id/noms',
      idKey: 'id',
      idValue: 7785,
      roles: ['managers', 'metrolog', 'omts', 'tech_calc'],
    },
    // {
    //   path: '/client/:clientId/noms',
    //   idKey: 'clientId',
    //   idValue: 248,
    //   roles: ['managers', 'metrolog', 'omts', 'tech_calc'],
    // },
  ]

  paths.forEach(({ path, idKey, idValue, roles }) => {
    const url = path.replace(`:${idKey}`, idValue)

    describe(`Проверка страницы ${path}`, () => {
      roles.forEach((role) => {
        it(`должна корректно загружаться для роли "${role}"`, () => {
          // Устанавливаем роль в localStorage перед загрузкой страницы
          cy.visit(url, {
            onBeforeLoad(win) {
              win.localStorage.setItem('selectedRole', role)
            },
          })

          // Проверяем, что URL содержит идентификатор и корректный путь
          cy.url().should('include', url)

          // Убеждаемся, что значение роли установлено в localStorage
          cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedRole')).to.eq(role)
          })

          // Небольшая задержка для рендеринга таблицы
          cy.wait(4000) // Можно настроить время ожидания в зависимости от производительности

          // Проверяем, что таблица данных отображается
          cy.get('.table-sbor')
            .should('exist') // Убедимся, что таблица существует в DOM
            .and('be.visible') // Убедимся, что таблица видима

          // Проверяем, что таблица содержит хотя бы одну строку данных
          cy.get('.table-sbor tbody tr').should('have.length.greaterThan', 0)

          // Можно добавить дополнительные проверки для элементов, уникальных для роли
        })
      })
    })
  })
})
