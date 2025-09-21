<script>
	let tab = 'tab1';
	import Fastflageditor from '$lib/components/fflageditor/fastflageditor.svelte';

	let initialFlags = [
		{ id: 1, name: 'Cy Ganderton', job: 'Quality Control Specialist', fav: 'Blue' },
		{ id: 2, name: 'Hart Hagerty', job: 'Desktop Support Technician', fav: 'Purple' },
		{ id: 3, name: 'Brice Swyre', job: 'Tax Accountant', fav: 'Red' }
	];
</script>

<div class="flex min-h-screen flex-col items-start">
	<!-- tabs pinned top-left with custom offset -->
	<div class="mt-[50px] ml-[220px] tabs tabs-box">
		<input
			type="radio"
			name="my_tabs_1"
			class="tab"
			aria-label="Tab 1"
			value="tab1"
			bind:group={tab}
			checked
		/>
		<input
			type="radio"
			name="Fast flag editor"
			class="tab"
			aria-label="Fast flag editor"
			value="Fast flag editor"
			bind:group={tab}
		/>
		<input
			type="radio"
			name="my_tabs_1"
			class="tab"
			aria-label="Tab 3"
			value="tab3"
			bind:group={tab}
		/>
	</div>

	<!-- centered content -->
	<div class="flex w-full justify-center">
		{#if tab === 'tab1'}
			<div class="p-4">content for tab 1</div>
		{:else if tab === 'Fast flag editor'}
			<Fastflageditor {initialFlags} />
		{:else if tab === 'tab3'}
			<div class="p-4">content for tab 3</div>
		{/if}
	</div>
</div>
