<script setup></script>
<template>
  <section class="masthead">
    <inner-column>
      <nav class="mast-head">
        <NuxtLink class="logo" href="/">home</NuxtLink>

        <slot name="end">
          <NuxtLink to="/profile">Profile</NuxtLink>
        </slot>
      </nav>
    </inner-column>
  </section>
</template>

<style scoped></style>
