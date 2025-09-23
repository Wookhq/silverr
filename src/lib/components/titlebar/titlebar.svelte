<script>
	const minimize = () => window.electronAPI.minimize();
	const maximize = () => window.electronAPI.maximize();
	const close = () => window.electronAPI.close();
</script>

<div
	class="title-bar fixed top-0 left-0 flex h-10 w-full items-center justify-end bg-base-200 shadow-md select-none"
	style="-webkit-app-region: drag; z-index: 50;"
>
	<button class="btn mr-1 btn-ghost btn-sm" style="-webkit-app-region: no-drag;" on:click={minimize}
		>_</button
	>
	<!-- <button class="btn mr-1 btn-ghost btn-sm" style="-webkit-app-region: no-drag;" on:click={maximize}
		>O</button
	> -->
	<button class="btn btn-sm btn-error" style="-webkit-app-region: no-drag;" on:click={close}
		>X</button
	>
</div>
