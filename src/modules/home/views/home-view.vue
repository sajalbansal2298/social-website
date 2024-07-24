<script setup lang="ts">
import TheWelcome from '../../../components/TheWelcome.vue';
import { cache } from '@/tools';
import { api } from '@/api';

api.doGetContent();
cache.insert('TEST', true);
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
