<template>
  <div class="container">
    <div class="top">this is the default layout</div>
    <slot></slot>
  </div>
</template>
<style scopes lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  min-width: 1280px;
  display: flex;
  align-items: center;
}

.top {
  background-color: red;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
