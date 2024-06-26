<script lang="ts">
import { onMount } from 'svelte';
import { AdjustmentsVertical, Cog6Tooth, Home as HomeIcon, Icon, Language, UserCircle } from 'svelte-hero-icons';
import { Route, Router } from 'svelte-routing';

import Home from './routes/Home.svelte';
import Profile from './routes/Profile.svelte';
import UserPreferences from './routes/UserPreferences.svelte';
import AddGame from './routes/protected/AddGame.svelte';
import Developper from './routes/protected/Developper.svelte';
import EditGame from './routes/protected/EditGame.svelte';
import EditTraductor from './routes/protected/EditTraductor.svelte';
import Settings from './routes/protected/Settings.svelte';

import HeaderBar from '$components/HeaderBar.svelte';
import InitialLoad from '$components/InitialLoad.svelte';
import NavLink from '$components/NavLink.svelte';
import ProtectedRoute from '$components/ProtectedRoute.svelte';
import Toaster from '$components/Toaster.svelte';
import { GAS_API } from '$lib/GAS_API';
import { fetchAppConfiguration } from '$lib/fetchAppConfig';
import { appConfiguration, isLoading, sessionUser, userIsAdmin, userIsSuperAdmin } from '$lib/stores';
import type { Toast } from '$types/index';

export let url = '';

export const handleNewToast = (event: CustomEvent<Toast>): void => {
  console.info('toast launch');
  console.info(event.detail);
  toasts = [...toasts, event.detail];
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== event.detail.id);
  }, event.detail.milliseconds);
};

$: initialLoadComplete = $sessionUser && $appConfiguration;

let isDrawerOpen = false;
const toggleDrawer = () => {
  isDrawerOpen = !isDrawerOpen;
};

let toasts: Toast[] = [];

onMount(() => {
  fetchUser();
  fetchAppConfiguration();
});

/**
 * Fetches the user from the server.
 */
const fetchUser = async () => {
  $isLoading = true;

  console.info('fetching user...');

  try {
    const result = await GAS_API.getUser();

    $sessionUser = result;

    console.info('User:', result);

    document.querySelector('html')?.setAttribute('data-theme', result.preferences.theme ?? 'dark');
  } catch (err) {
    console.error('Could not get user:', err); // TODO: dispatch toast
  } finally {
    console.info('User loaded.');

    $isLoading = false;
  }
};
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
        on:change={toggleDrawer} />

      <div class="drawer-content bg-base-200">
        <!-- Page content here -->
        <HeaderBar title={$appConfiguration.appName} />

        <div class="container mx-auto pb-8">
          <Route path="*">
            <Home on:newToast={handleNewToast} />
          </Route>
          <ProtectedRoute path="settings">
            <Settings on:newToast={handleNewToast} />
          </ProtectedRoute>
          <Route path="user-preferences">
            <UserPreferences on:newToast={handleNewToast} />
          </Route>
          <Route path="user/:email" let:params>
            <Profile email={params.email} />
          </Route>
          <ProtectedRoute path="add">
            <AddGame on:newToast={handleNewToast} />
          </ProtectedRoute>
          <ProtectedRoute path="edit">
            <EditGame on:newToast={handleNewToast} />
          </ProtectedRoute>
          <ProtectedRoute path="traductor">
            <EditTraductor on:newToast={handleNewToast} />
          </ProtectedRoute>
          <ProtectedRoute path="dev" superAdmin>
            <Developper on:newToast={handleNewToast} />
          </ProtectedRoute>
        </div>
      </div>
      <div class="drawer-side">
        <!-- Sidebar content here -->
        <label for="nav-drawer-control" class="drawer-overlay"></label>
        <ul class="menu h-full w-80 bg-base-200 p-4 pt-16 text-base-content">
          <NavLink to="/" onClick={toggleDrawer}>
            <Icon src={HomeIcon} size="1rem" />
            Accueil
          </NavLink>

          {#if $userIsAdmin}
            <NavLink to="/settings" onClick={toggleDrawer}>
              <Icon src={Cog6Tooth} size="1rem" />
              Paramètres
            </NavLink>
            <NavLink to="/traductor" onClick={toggleDrawer}>
              <Icon src={Language} size="1rem" />
              Traducteurs
            </NavLink>
          {/if}

          <NavLink to="/user-preferences" onClick={toggleDrawer}>
            <Icon src={UserCircle} size="1rem" />
            Préférences utilisateur
          </NavLink>
          <div class="divider"></div>

          {#if $userIsSuperAdmin}
            <NavLink to="/dev" onClick={toggleDrawer}>
              <Icon src={AdjustmentsVertical} size="1rem" />
              Panel développeur
            </NavLink>
          {/if}
        </ul>
      </div>
    </div>
  {/if}

  <Toaster {toasts} />
</Router>
