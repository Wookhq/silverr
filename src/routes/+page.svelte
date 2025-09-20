<script>
  import heroImage from '$lib/assets/silverrbanner.svg';

  const whatsNew = () => {
    alert("Here's what's new! 🚀");
    // or open a modal / popup instead of alert
  };
</script>

<div class="p-6 max-w-xl mx-auto text-center space-y-4">
  <h1 class="text-3xl font-bold">Welcome to Silverr!</h1>

  <img src={heroImage} alt="cooked" class="mx-auto rounded-lg shadow-lg" />

  <button class="btn btn-primary" on:click={whatsNew}>
    What's new?
  </button>

  <p>Silverr is a bootstrapper for Sober. Try out one of the features!</p>
  <p>Thank you for using Silverr!</p>
  <p class="italic">-- wookhq</p>
</div>
