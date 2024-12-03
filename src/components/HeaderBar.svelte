<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, sessionUser } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { onMount } from 'svelte';
import { Bars3, Icon } from 'svelte-hero-icons';
import { Link, navigate } from 'svelte-routing';
import packageJson from '../../package.json';

interface Props {
  title?: string;
}

const { title = '' }: Props = $props();

let count = $state(0);

onMount(async () => {
  if (checkUser(['admin', 'superAdmin'])) {
    const submits = await GAS_API.getSubmits({});

    if (!submits) return;

    const submitsWait = submits.filter((submit) => submit.status === 'wait');

    count = submitsWait.length;
  }
});
</script>

<div class="navbar mb-8 bg-base-100" class:loading-border={$isLoading}>
  <div class="flex-none">
    <label for="nav-drawer-control" class="btn btn-square btn-ghost relative">
      <Icon src={Bars3} size="1.5rem" />
      {#if count > 0}
        <span class="badge badge-error absolute top-1 right-1 size-4 p-0 pb-0.5 text-white text-xs">{count}</span>
      {/if}
    </label>
  </div>
  <div class="flex-1">
    <div class="btn btn-ghost text-xl normal-case">
      <Link to="/">{title} <span class="badge">v{packageJson.version} - BETA</span></Link>
    </div>
  </div>

  <button
    class="btn btn-circle btn-ghost flex-none hover:scale-105"
    onclick={() => navigate(`/user/${$sessionUser?.email}`)}>
    <img
      class="avatar w-10 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100"
      alt={$sessionUser?.profile.pseudo ?? "The user"}
      src={$sessionUser?.profile?.imageUrl ||
        "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"} />
  </button>
</div>

<style lang="postcss">
  @keyframes loading {
    0% {
      border-bottom-color: transparent;
    }
    35% {
      border-bottom-color: hsl(var(--p));
    }
    50% {
      border-bottom-color: hsl(var(--pf));
    }
    65% {
      border-bottom-color: hsl(var(--p));
    }
    100% {
      border-bottom-color: transparent;
    }
  }

  .loading-border {
    border-bottom: 2px solid transparent;
    animation: loading 1s linear infinite;
  }
</style>
