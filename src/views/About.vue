<template>
  <div>
    <div class="line">

    </div>
    <div class="card-grid">
      <Card style="margin-left: 0;"></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
    </div>
  </div>
</template>
<script>
import Card from "../components/Card";
export default {
  name:'index',
  components: {Card}
}
</script>
<style scoped>
.card-grid{
  padding: 3rem 0 3rem 2rem;
  margin: 0;
  display: flex;
  /*overflow-x: scroll;*/
  padding-left: 80px;
  place-content: center;
}
</style>
