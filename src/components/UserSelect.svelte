<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { GAS_API } from "$lib/GAS_API";
  import type { UserType } from "$types/schemas";

  const dispatch = createEventDispatcher();

  let searchQuery = "";
  let searching = false;
  let searchCount = 0;
  let searchResults: UserType[] = [];
  let selectedUsers: UserType[] = [];

  let debounceTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    selectedUsers = [];
    dispatch("update", selectedUsers);

    // Simulating a server request
    console.info(`Fetching results users`);
    searching = true;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const result = await GAS_API.getUsers();

        console.info({ result });

        if (result) {
          searchResults = result;
        } else {
          searchResults = [];
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        searchCount = searchCount + 1;
        searching = false;
      }
    }, 1000);
  });

  const toggleSelect = (user: UserType) => {
    const index = selectedUsers.findIndex((selected) => selected.email === user.email);

    if (index > -1) {
      selectedUsers.splice(index, 1);
      selectedUsers = [...selectedUsers];
    } else {
      selectedUsers.push(user);
      selectedUsers = [...selectedUsers];
    }

    // Notify the parent component
    dispatch("update", selectedUsers);
  };
</script>

<div>
  <div class="pt-4">
    {#each searchResults as userResult}
      <div
        class="my-2 flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-base-200"
        on:click={(e) => toggleSelect(userResult)}
        on:keypress={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            toggleSelect(userResult);
          }
        }}
        role="button"
        tabindex="0"
        class:bg-base-200={selectedUsers.some((selected) => selected.email === userResult.email)}>
        <div class="flex items-center justify-center space-x-3">
          <div class="mask mask-squircle h-12 w-12">
            <img
              src={userResult.profile?.imageUrl ??
                "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
              alt="User" />
          </div>
          <div>
            <div class="font-bold">{userResult.email}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
