<script lang="ts">
  import { appConfiguration, isLoading, sessionUser } from '$lib/stores'
  import { Link, navigate } from 'svelte-routing'

  export let title = ''

  console.log('sessionUser', $sessionUser)
  console.log('appConfiguration', $appConfiguration.appName)
</script>

<div class="navbar mb-8 bg-base-100" class:loading-border={$isLoading}>
  <div class="flex-none">
    <label for="nav-drawer-control" class="btn btn-square btn-ghost">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block h-5 w-5 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </label>
  </div>
  <div class="flex-1">
    <div class="btn btn-ghost text-xl normal-case">
      <Link to="/">{title}</Link>
    </div>
  </div>

  <button
    class="flex-none btn btn-circle btn-ghost hover:scale-105"
    on:click={() => navigate(`/user/${$sessionUser?.email}`)}
  >
    <img
      class="w-10 avatar rounded-full ring ring-primary ring-offset-1 ring-offset-base-100"
      alt={$sessionUser?.profile.pseudo ?? 'The user'}
      src={$sessionUser?.profile?.imageUrl}
    />
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
