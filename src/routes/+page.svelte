<script>
	import heroImage from '$lib/assets/silverrbanner.svg';
	import Wordsfadein from '$lib/fadein/wordsfadein.svelte';

	const whatsNew = () => {
		alert("Here's what's new! 🚀");
		// or open a modal / popup instead of alert text-4xl font-bold
	};
</script>

<div class="mx-auto max-w-xl space-y-4 p-6 text-center">
	<Wordsfadein words="Welcome to Silverr!" class="md:text-7x2 text-3xl font-bold" />
	<img src={heroImage} alt="cooked" class="mx-auto rounded-lg shadow-lg" />

	<button class="btn btn-primary" on:click={whatsNew}> What's new? </button>

	<p>Silverr is a bootstrapper for Sober. Try out one of the features!</p>
	<p>Thank you for using Silverr!</p>
	<p class="italic">-- wookhq</p>
</div>
