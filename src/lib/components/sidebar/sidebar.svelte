<script>
	export let drawerId = 'my-drawer-2';
	import logo from '$lib/assets/logo.svg';
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
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<li><a href="/">Home</a></li>
			<li><a href="/fastflag">Fastflag</a></li>
			<li><a href="/mods">Mods</a></li>
			<!-- <li><a href="/marketplace">Marketplace</a></li> -->
		</ul>
	</div>
</div>
