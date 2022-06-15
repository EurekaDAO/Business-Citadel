
<script>
	import Auth from '$lib/components/Auth.svelte';
  import Transaction from '$lib/components/Transaction.svelte';
  import { PAGE_TITLE_EXTENSION } from "$lib/constants";
</script>

<svelte:head>
	<title>Home {PAGE_TITLE_EXTENSION}</title>
</svelte:head>

<div class="mb-2">
  <Transaction />
</div>

<Auth/>