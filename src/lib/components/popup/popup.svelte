<script>
  import { onMount } from "svelte";
  let modal;

  onMount(() => {
    modal.showModal();
  });
</script>

<dialog bind:this={modal} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Wellcome to Silverr!</h3>
    <p class="py-4">Thanks for trying out Silverr alpha, any bugs please report to our discord server</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">close</button>
      </form>
    </div>
  </div>
</dialog>
