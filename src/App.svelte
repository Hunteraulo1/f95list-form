<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { fetchAppConfiguration } from '$lib/fetchAppConfig';
import { appConfiguration, isLoading, sessionUser } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { onMount } from 'svelte';
import { Route as RoutePrimitive, Router } from 'svelte-routing';

import Home from './routes/Home.svelte';
import Profile from './routes/Profile.svelte';
import AddGame from './routes/protected/AddGame.svelte';
import Developper from './routes/protected/Developper.svelte';
import EditGame from './routes/protected/EditGame.svelte';
import EditTraductor from './routes/protected/EditTraductor.svelte';
import MySubmits from './routes/protected/MySubmits.svelte';
import Settings from './routes/protected/Settings.svelte';
import Submits from './routes/protected/Submits.svelte';
import UserPreferences from './routes/protected/UserPreferences.svelte';

import HeaderBar from '$components/HeaderBar.svelte';
import InitialLoad from '$components/InitialLoad.svelte';
import NavLink from '$components/NavLink.svelte';
import Route from '$components/Route.svelte';
import Toaster from '$components/Toaster.svelte';
import { Bug, CircleUserRound, Cog, House, Inbox, Languages } from '@steeze-ui/lucide-icons';
import { Icon } from '@steeze-ui/svelte-icon';

interface Props {
  url?: string;
}

const { url = '' }: Props = $props();

const initialLoadComplete = $derived($sessionUser && $appConfiguration);
let count = $state(0);

let isDrawerOpen = $state(false);
const toggleDrawer = (): void => {
  isDrawerOpen = !isDrawerOpen;
};

onMount(async () => {
  $isLoading = true;

  console.info('fetching user...');

  try {
    const result = await GAS_API.getUser();

    $sessionUser = result;

    console.info('User:', result);

    document.querySelector('html')?.setAttribute('data-theme', result.preferences.theme ?? 'dark');

    if (checkUser(['admin', 'superAdmin'])) {
      const submits = await GAS_API.getSubmits({});

      if (!submits) return;

      const submitsWait = submits.filter((submit) => submit.status === 'wait');

      count = submitsWait.length;
    }
  } catch (err) {
    console.error('Could not get user:', err); // TODO: dispatch toast
  } finally {
    console.info('User loaded.');

    $isLoading = false;
  }

  fetchAppConfiguration();
});
</script>

<Router {url}>
  {#if !initialLoadComplete}
    <InitialLoad />
  {:else}
    <div class="drawer min-h-screen">
      <input
        id="nav-drawer-control"
        type="checkbox"
        class="drawer-toggle"
        checked={isDrawerOpen}
        onchange={toggleDrawer} />

      <div class="drawer-content bg-base-200">
        <!-- Page content here -->
        <HeaderBar title={$appConfiguration.appName} {count} />

        <div class="container mx-auto pb-8">
          <Route path="*">
            <Home />
          </Route>
          <Route path="settings" ranks={["admin", "superAdmin"]}>
            <Settings />
          </Route>
          <Route path="user-preferences">
            <UserPreferences />
          </Route>
          <RoutePrimitive path="user/:email" >
            {#snippet children({ params }: { params: { email: string } })}
              <Profile email={params.email} />
            {/snippet}
          </RoutePrimitive>
          <Route path="add" ranks={["traductor", "admin", "superAdmin"]}>
            <AddGame />
          </Route>
          <Route path="edit" ranks={["traductor", "admin", "superAdmin"]}>
            <EditGame />
          </Route>
          <Route path="traductor" ranks={["admin", "superAdmin"]}>
            <EditTraductor />
          </Route>
          <Route path="submits" ranks={["admin", "superAdmin"]}>
            <Submits />
          </Route>
          <Route path="mysubmits" ranks={["traductor", "superAdmin"]}>
            <MySubmits />
          </Route>
          <Route path="dev" ranks={["superAdmin"]}>
            <Developper />
          </Route>
        </div>
      </div>
      <div class="drawer-side">
        <!-- Sidebar content here -->
        <label for="nav-drawer-control" class="drawer-overlay"></label>
        <ul class="menu h-full w-80 bg-base-200 p-4 pt-16 text-base-content">
          <NavLink to="/" onClick={toggleDrawer}>
            <Icon src={House} size="1rem" />
            Accueil
          </NavLink>

          {#if checkUser(['admin', 'superAdmin'])}
            <NavLink to="/settings" onClick={toggleDrawer}>
              <Icon src={Cog} size="1rem" />
              Paramètres
            </NavLink>
            <NavLink to="/traductor" onClick={toggleDrawer}>
              <Icon src={Languages} size="1rem" />
              Traducteurs
            </NavLink>
            <NavLink to="/submits" onClick={toggleDrawer}>
              <Icon src={Inbox} size="1rem" />
              Soumissions
              {#if count > 0}
                <span class="badge badge-error size-4 p-0 pb-0.5 text-white text-xs">{count}</span>
              {/if}
            </NavLink>
          {/if}

          {#if checkUser(['traductor', 'superAdmin'])}
            <NavLink to="/mysubmits" onClick={toggleDrawer}>
              <Icon src={Inbox} size="1rem" />
              Mes Soumissions
            </NavLink>
          {/if}

          <NavLink to="/user-preferences" onClick={toggleDrawer}>
            <Icon src={CircleUserRound} size="1rem" />
            Préférences utilisateur
          </NavLink>
          <div class="divider"></div>

          {#if checkUser(['superAdmin', 'superAdmin'])}
            <NavLink to="/dev" onClick={toggleDrawer}>
              <Icon src={Bug} size="1rem" />
              Panel développeur
            </NavLink>
          {/if}
        </ul>
      </div>
    </div>
  {/if}

  <Toaster />
</Router>
