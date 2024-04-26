<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Link } from "svelte-routing";

  import AddAdminModal from "$components/AddAdminModal.svelte";
  import Panel from "$components/Panel.svelte";
  import RemoveAdminModal from "$components/RemoveAdminModal.svelte";
  import { GAS_API } from "$lib/GAS_API";
  import { appConfiguration, isLoading, sessionUser, userIsSuperAdmin } from "$lib/stores";
  const dispatch = createEventDispatcher();

  let webhookUpdateUrl = "";
  let webhookLogsUrl = "";

  const handleClick = async () => {
    if ($appConfiguration !== null) {
      await updateAppConfiguration();
    } else {
      console.error("App configuration is null.");
    }
  };

  const updateAppConfiguration = async () => {
    $isLoading = true;

    console.info("submitting app configuration update", $appConfiguration);

    try {
      await GAS_API.putAppConfiguration({
        appConfiguration: $appConfiguration,
        webhooks: {
          update: webhookUpdateUrl,
          logs: webhookLogsUrl,
        },
      });

      dispatch("newToast", {
        id: Date.now(),
        alertType: "success",
        message: "Configuration de l'application mise à jour !",
        milliseconds: 3000,
      });
    } catch (error) {
      console.error("Erreur de transmission des changements de l'utilisateur", error);
      dispatch("newToast", {
        id: Date.now(),
        alertType: "error",
        message: "Vos modifications n'ont pas pu être enregistrées",
        milliseconds: 3000,
      });
    } finally {
      $isLoading = false;
    }
  };

  let dialogAdd: Boolean;
  let dialogRemove: Boolean[] = [];
</script>

<div>
  {#if $appConfiguration}
    <Panel title="General">
      <button slot="button" class="btn" on:click={handleClick} disabled={!$userIsSuperAdmin}>Sauvegarder</button>
      <p class="text-gray-500" slot="description">
        Modifiez les paramètres de l'application. N'oubliez pas de sauvegarder !
      </p>
      <div slot="panel-content" class="flex w-full gap-8">
        <div class="w-full max-w-xs">
          <label class="label" for="app-name">
            <span class="label-text">Nom de l'application</span>
          </label>
          <input
            bind:value={$appConfiguration.appName}
            disabled={$isLoading || !$userIsSuperAdmin}
            type="text"
            placeholder="Nom de l'application"
            class="input input-bordered w-full"
            name="app-name" />
        </div>
        <div class="w-full max-w-xs">
          <label class="label" for="app-update">
            <span class="label-text">Url du webhook des mise à jours</span>
          </label>
          <input
            bind:value={webhookLogsUrl}
            disabled={$isLoading || !$userIsSuperAdmin}
            type="text"
            placeholder="url du webhook des mise à jours"
            class="input input-bordered w-full"
            name="app-update" />
        </div>
        <div class="w-full max-w-xs">
          <label class="label" for="app-logs">
            <span class="label-text">Url du webhook des logs</span>
          </label>
          <input
            bind:value={webhookUpdateUrl}
            disabled={$isLoading || !$userIsSuperAdmin}
            type="text"
            placeholder="url du webhook des logs"
            class="input input-bordered w-full"
            name="app-logs" />
        </div>
      </div>
    </Panel>

    <Panel title="Admins">
      <button
        slot="button"
        on:click={() => (dialogAdd = true)}
        disabled={!($sessionUser?.roles.includes("superAdmin") || $sessionUser?.roles.includes("admin"))}
        class="btn">
        Ajouter un administrateur
      </button>
      <p class="text-gray-500" slot="description">Ajouter des administrateurs au formulaire !</p>
      <div slot="panel-content">
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {#each $appConfiguration.admins as admin, index}
                <!-- row -->
                <tr>
                  <td>
                    <Link to="/user/{admin.email}">
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={admin.profile?.imageUrl ||
                                "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">
                            {admin.email}
                          </div>
                          <div>
                            {#each admin.roles as role}
                              <span class="badge badge-ghost badge-sm mr-2">{role}</span>
                            {/each}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <th>
                    <button on:click={() => (dialogRemove[index] = true)} class="btn btn-ghost btn-xs"
                      >Supprimer</button>
                    <RemoveAdminModal bind:showModal={dialogRemove[index]} on:newToast user={admin} />
                  </th>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>

    <AddAdminModal bind:showModal={dialogAdd} on:newToast />
  {/if}
</div>
