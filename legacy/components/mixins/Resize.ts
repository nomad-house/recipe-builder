import { Component, Vue } from 'vue-property-decorator'

@Component({})
export class Resize extends Vue {
  private resizeListner() {
    if (
      Object.prototype.hasOwnProperty.call(this, 'onResize') &&
      typeof (this as any).onResize === 'function'
    ) {
      ;(this as any).onResize()
    }
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
