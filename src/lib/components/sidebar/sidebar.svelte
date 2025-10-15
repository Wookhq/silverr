<script>
	export let drawerId = 'my-drawer-2';
	import logo from '$lib/assets/logo.svg';
	import Home from 'lucide-svelte/icons/home';
	import Flag from 'lucide-svelte/icons/flag';
	import Archive from 'lucide-svelte/icons/archive';
	import CloudCog from 'lucide-svelte/icons/cloud-cog';
	import Info from 'lucide-svelte/icons/info';
</script>

<div class="drawer lg:drawer-open">
	<input id={drawerId} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-center">
		<slot />
		<label for={drawerId} class="drawer-button btn btn-primary lg:hidden"> Sidebar </label>
	</div>
	<div class="drawer-side">
		<img src={logo} alt="Logo" class="mx-auto mb-4 h-40 w-50 object-contain" />

		<div class="mx-auto badge block badge-outline badge-warning">ALPHA</div>

		<label for={drawerId} aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu mx-auto min-h-full w-80 bg-base-200 py-4 text-base-content">
			<li>
				<a href="/">
					<Home class="h-6 w-6" />
					Home</a
				>
			</li>
			<li>
				<a href="/fastflag">
					<Flag class="h-6 w-6" />
					Fastflag</a
				>
			</li>
			<li>
				<a href="/mods">
					<Archive class="h-6 w-6" />
					Mods</a
				>
			</li>
			<li>
				<a href="/crossover">
					<CloudCog class="h-6 w-6" />
					Crossover</a
				>
			</li>
			<li>
				<a href="/about">
					<Info class="h-6 w-6" />
					About</a
				>
			</li>
		</ul>
	</div>
</div>
