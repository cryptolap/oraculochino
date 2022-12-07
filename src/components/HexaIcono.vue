<template>
<div>
    <div :class="valor" v-for="(valor,keys) in iconVector" :key="keys" :style="iconColor"></div>
</div>
</template>

<script>
export default {
    name: 'HexaIcono',
    props: ["indice", "color"],
  watch: {
      indice: {
        handler(indice) {
          this.iconVector = Array.from(this.indice, val => val==1? val = 'uno' : val = 'cero').reverse()
          this.iconColor = "color: " + this.color
        },
      immediate: true,
      }
    },
    data () {
      return {
        iconVector: ['uno','uno','uno','uno','uno','uno'],
        iconColor: "color: #C00"
      }
    }
}
</script>

<style scoped>

.uno {
  /* color: #C00; */
  position: relative;
  margin-left: 2px;
  margin-top: 2px;
  width: 22px;
  height: 2px;
  border: solid 1px currentColor;
  background-color: currentColor;
}

.cero {
  /* color: #C00; */
  position: relative;
  margin-left: 2px;
  margin-top: 2px;
  width: 8px;
  height: 2px;
  border: solid 1px currentColor;
  background-color: currentColor;
}

.cero:before {
  content: '';
  /* color: #C00; */
  position: absolute;
  top: -1px;
  left: 13px;
  width: 8px;
  height: 2px;
  border: solid 1px currentColor;
  background-color: currentColor;
}

</style>

