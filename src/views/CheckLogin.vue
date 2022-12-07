<template>
<v-container grid-list-md class="info" text-xs-center>
  <v-tab>
    Cargando...
  </v-tab>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import { isNil } from 'lodash'

export default {
  computed: mapState('usuarios', ['user']),
  watch: {
    user: {
      handler(user) {
        if (user === undefined) return

        if (this.$route.query.redirectUrl === this.$route.path) {
          this.$router.push('/')
        }

        const redirectUrl = isNil(user)
          ? `/login?redirectUrl=${this.$route.query.redirectUrl}`
          : this.$route.query.redirectUrl

        this.$router.push(redirectUrl)
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
