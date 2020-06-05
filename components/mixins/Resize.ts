import { Component, Vue } from 'vue-property-decorator'

@Component({})
export class Resize extends Vue {
  private resizeListner() {
    this.$emit('resize')
  }

  created() {
    if (!this.$isServer) {
      window.addEventListener('resize', this.resizeListner)
    }
  }

  beforeDestroy() {
    if (!this.$isServer) {
      window.removeEventListener('resize', this.resizeListner)
    }
  }
}
