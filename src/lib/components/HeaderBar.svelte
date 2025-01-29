<script lang="ts">
import { sessionUser } from '$lib/stores';
import { AlignJustify } from '@steeze-ui/lucide-icons';
import { Icon } from '@steeze-ui/svelte-icon';
import { onMount } from 'svelte';
import { Link, navigate } from 'svelte-routing';
import packageJson from '../../../package.json';

interface Props {
  title?: string;
  count: number;
}

const { title = '', count }: Props = $props();

onMount(async () => {});
</script>

<div class="navbar mb-8 bg-base-100">
  <div class="flex-none">
    <label for="nav-drawer-control" class="btn btn-square btn-ghost relative">
      <Icon src={AlignJustify} size="1.5rem" />
      {#if count > 0}
        <span class="badge badge-error absolute top-1 right-1 size-4 p-0 pb-0.5 text-white text-xs">{count}</span>
      {/if}
    </label>
  </div>
  <div class="flex-1">
    <div class="btn btn-ghost text-xl normal-case">
      <Link to="/">{title} <span class="badge">v{packageJson.version}</span></Link>
    </div>
  </div>

  <button
    class="btn btn-circle btn-ghost flex-none hover:scale-105"
    onclick={() => navigate(`/user/${$sessionUser?.email}`)}>
    <img
      class="avatar w-full rounded-full leading-8 h-full ring ring-primary ring-offset-1 ring-offset-base-100"
      alt={$sessionUser?.profile.pseudo ?? "The user"}
      src={$sessionUser?.profile?.imageUrl ||
        "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"} />
  </button>
</div>
