<template>
    <div>
        <b-button v-b-popover.hover="popoverConfig"
        variant="info"> {{ btnTxt }} </b-button>
    </div>
</template>

<script>
export default {
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    btnTxt: {
      type: String,
      default: 'Info'
    }
  },
  computed: {
    popoverConfig () {
      // Both title and content specified as a function in this example
      // and will be called each time popover is opened
      return {
        html: true,
        title: () => this.title,
        content: () => this.content
      }
    }
  }
}
</script>
