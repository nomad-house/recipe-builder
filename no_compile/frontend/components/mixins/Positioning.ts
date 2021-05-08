import { Component, Vue } from 'vue-property-decorator'

export interface ScrollInfo {
  position: number
  direction: 'up' | 'down'
}

@Component({})
export class Positioning extends Vue {
  public lastScrollPosition = 0
  public scrollDirection: 'up' | 'down' = 'down'

  private scrollListner() {
    const current = window.scrollY
    this.scrollDirection = current < this.lastScrollPosition ? 'up' : 'down'
    this.lastScrollPosition = current
    this.$emit('scroll', {
      position: this.lastScrollPosition,
      direction: this.scrollDirection
    })
  }

  created() {
    if (!this.$isServer) {
      window.addEventListener('scroll', this.scrollListner)
    }
  }

  beforeDestroy() {
    if (!this.$isServer) {
      window.removeEventListener('scroll', this.scrollListner)
    }
  }
}
