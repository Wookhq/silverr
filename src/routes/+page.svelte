<script>
  import heroImage from '$lib/assets/silverrbanner.svg';
  import Wordsfadein from '$lib/fadein/wordsfadein.svelte';

  const whatsNew = () => {
    alert("Here's what's new! 🚀");
    // or open a modal / popup instead of alert text-4xl font-bold 
  };
</script>

<div class="p-6 max-w-xl mx-auto text-center space-y-4">
  <Wordsfadein words="Welcome to Silverr!" class="text-3xl font-bold md:text-7x2" />
  <img src={heroImage} alt="cooked" class="mx-auto rounded-lg shadow-lg" />

  <button class="btn btn-primary" on:click={whatsNew}>
    What's new?
  </button>

  <p>Silverr is a bootstrapper for Sober. Try out one of the features!</p>
  <p>Thank you for using Silverr!</p>
  <p class="italic">-- wookhq</p>
</div>
