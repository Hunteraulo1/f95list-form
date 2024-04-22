<script lang="ts">
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import { Link } from 'svelte-routing'
</script>

<div class="flex flex-col items-center justify-center py-20">
  <div class="text-[hsl(var(--er))]">
    <Icon src={ExclamationTriangle} size="3rem" />
  </div>
  <div class="pt-2 pb-2">
    <p>La page demandée n'existe pas ou vous n'avez pas accès à cette page.</p>
  </div>
  <div class="py-4">
    <h2>
      <Link to="/"><span class="link">Retour à la page d'accueil</span></Link>
    </h2>
  </div>
</div>
