<template>
  <div class="input-container">
    <input type="text" id="input" required class="styled-input" />
    <label for="input" class="floating-label">поиск детали по партии</label>
  </div>
</template>

<style scoped>
.input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Стили для поля ввода */
.styled-input {
  width: 100%;
  padding: 12px 10px 12px 10px;
  font-size: 16px;
  color: #2d2d2d;
  background-color: #ffffff; /* Темный фон */
  border: 1px solid #ccc; /* Светлая рамка */
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

.styled-input:focus {
  border-color: #ffffff; /* Белая рамка при фокусе */
}

/* Стили для плавающего лейбла */
.floating-label {
  position: absolute;
  left: 12px;
  padding: 0 5px;
  color: #2d2d2d; /* Светлый текст */
  font-size: 16px;
  background-color: #d8d8d8; /* Совпадает с фоном инпута */
  pointer-events: none;
  transition:
    transform 0.3s ease,
    font-size 0.3s ease,
    color 0.3s ease;
}

/* Поднимает лейбл вверх при фокусе или наличии текста */
.styled-input:focus + .floating-label,
.styled-input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-26px); /* Поднимает лейбл вверх */
  font-size: 12px; /* Уменьшает размер шрифта */
  color: #ffffff; /* Делает текст ярче */
}
</style>
