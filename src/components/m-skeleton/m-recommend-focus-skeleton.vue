<template>
    <div class="skeleton focus-skeleton">
    </div>
</template>

<script>
  export default {
    name: 'm-recommend-focus-skeleton'
  }
</script>

<style lang="less">
    .skeleton {
        background: linear-gradient(90deg, #303031 25%, #373737 37%, #303031 63%);
        background-size: 400% 100%;
        animation: skeleton-loading 2s ease infinite;
    }

    .focus-skeleton {
        width: 100%;
        height: 240px;
        position: relative;
        z-index: 0;
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }
</style>
