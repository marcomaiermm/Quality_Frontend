<template>
  <div id="myModal" class="modal">
    <div class="modal-content">
      <img
        src="../../assets/spinning-logo.gif"
        style="width:100%;height:100%;pointer-events: none;"
        alt="Loading"
        no-pointer-events
      />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  /* overflow: auto;  Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.1); /* Black w/ opacity */
}
/* Modal Content */
.modal-content {
  background-color: rgba(0, 0, 0, 0);
  margin: auto;
  padding: 20px;
  border: 0px solid #888;
  width: 30%;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>