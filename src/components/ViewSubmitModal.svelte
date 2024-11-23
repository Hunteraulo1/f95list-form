<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { getConvert } from '$lib/convert';
import { isLoading, newToast } from '$lib/stores';
import type { GameType, SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';
import FormGame from './FormGame.svelte';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  submits: SubmitType[];
  index: number;
  user: UserType;
}

let { showModal = $bindable(), submits = $bindable(), index, user }: Props = $props();

const submit = $state(submits[index]);
let denyModal = $state(false);

interface GameAttributes {
  label: string;
  value: GameType[keyof GameType];
  queryValue: GameType[keyof GameType] | null;
}
let gameAttributes = $state<GameAttributes[]>([]);
let editor = $state<boolean>(false);
let deleteModalValue = $state<boolean>(false);

onMount(async () => {
  if (submit.type === 'delete') {
    deleteModalValue = true;
  }

  let queryGame: GameType | null = null;

  if (submit.type !== 'add') {
    queryGame = await GAS_API.getGame(submit.query);
  }

  gameAttributes = [
    { label: 'Auto-Check', value: submit.game.ac, queryValue: queryGame?.ac ?? null },
    { label: 'Domaine', value: submit.game.domain, queryValue: queryGame?.domain ?? null },
    { label: 'ID du jeu', value: submit.game.id, queryValue: queryGame?.id ?? null },
    { label: 'Image du jeu', value: submit.game.image, queryValue: queryGame?.image ?? null },
    { label: 'Lien du jeu', value: submit.game.link, queryValue: queryGame?.link ?? null },
    { label: 'Nom du jeu', value: submit.game.name, queryValue: queryGame?.name ?? null },
    { label: 'Relecteur', value: submit.game.proofreader, queryValue: queryGame?.proofreader ?? null },
    { label: 'Status', value: submit.game.status, queryValue: queryGame?.status ?? null },
    { label: 'Tags', value: submit.game.tags, queryValue: queryGame?.tags ?? null },
    { label: 'Lien de la traduction', value: submit.game.tlink, queryValue: queryGame?.tlink ?? null },
    { label: 'Nom de la traduction', value: submit.game.tname, queryValue: queryGame?.tname ?? null },
    { label: 'Traductor', value: submit.game.traductor, queryValue: queryGame?.traductor ?? null },
    { label: 'Type de traduction', value: submit.game.ttype, queryValue: queryGame?.ttype ?? null },
    { label: 'Version de traduction', value: submit.game.tversion, queryValue: queryGame?.tversion ?? null },
    { label: 'Type de jeu', value: submit.game.type, queryValue: queryGame?.type ?? null },
  ];
});

const handleUpdateSubmit = async (type: 'validated' | 'rejected') => {
  editor = false;
  $isLoading = true;

  try {
    const result = await GAS_API.putSubmit({ submit, type });

    console.info('Submit updated:', result);

    newToast({
      alertType: 'success',
      message: 'Soumission mise à jour!',
    });
  } catch (error) {
    console.error('Could not update submit:', error);

    newToast({
      alertType: 'error',
      message: 'Erreur lors de la mise à jour de la soumission',
    });
  } finally {
    $isLoading = false;
  }
};

const handleClickConfirm = () => {
  editor = true;
  showModal = false;
};

interface SubmitAttributes {
  label: string;
  value: SubmitType[keyof SubmitType];
}
const submitAttributes: SubmitAttributes[] = [
  { label: 'Commentaire', value: submit.comment },
  { label: 'Date', value: submit.date },
  { label: 'Raison', value: submit.reason },
  { label: 'Status', value: getConvert(submit.status, 'status') },
  { label: 'Type', value: getConvert(submit.type, 'types') },
];
</script>


<Modal bind:showModal title="Soumission" bigger>
  {#snippet modalContent()}
    <div class="my-2 flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-base-200">
      <div class="flex items-center justify-center space-x-3">
        <div class="mask mask-squircle h-12 w-12">
          <img
          src={user.profile.imageUrl ||
              "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
            alt="Game" />
          </div>
          <div>
            <div class="font-bold">{submit.email}</div>
          </div>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      {#each submitAttributes as { label, value }}
        {#if value !== ''}
          <div>
            <div class="font-bold">{label}</div>
            <div>{value}</div>
          </div>
          {/if}
        {/each}
      </div>
        
      <div class="divider"></div>
      
      <div class="grid grid-cols-2 gap-4">
        {#each gameAttributes as { label, value, queryValue }}
          <div class="w-full relative">
            <div class="font-bold">{label}</div>
            {#if label === 'Auto-Check'}
              <div>{value ? 'Oui' : 'Non'}</div>
            {:else}
              <div class="overflow-x-auto">{value === '' ? 'N/A' : value}</div>
              {#if submit.type !== 'add' && value !== queryValue}
                <div class="text-xs text-gray-500">({queryValue  === '' ? 'N/A' : queryValue})</div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    {/snippet}
    {#snippet modalAction()}
      <button onclick={handleClickConfirm} class="btn">
        Confirmer
      </button>
      <button onclick={() => { denyModal = true }} class="btn">
        Refuser
      </button>
  {/snippet}
</Modal>

{#if editor}
  <div class="fixed flex items-center top-0 left-0 w-full h-full bg-base-200 overflow-y-auto z-50">
    <FormGame bind:game={submit.game} edit={submit.type !== 'add'} {handleUpdateSubmit} bind:editor={editor} step={5} deleteMode={submit.type === 'delete'} />  
  </div>
{/if}

<Modal bind:showModal={denyModal} title="Refus de la soumission">
  {#snippet modalContent()}    
    <p class="py-4">Raison du refus ?</p>
    <textarea
      bind:value={submit.reason}
      placeholder="Pourquoi voulez-vous refuser la soumission ?"
      class="textarea textarea-bordered max-h-32 w-full">
    </textarea>
  {/snippet}
  {#snippet modalAction()}
    <button
      onclick={() => handleUpdateSubmit('rejected')}
      class="btn btn-error">
      Refuser
    </button>
  {/snippet}
</Modal>
