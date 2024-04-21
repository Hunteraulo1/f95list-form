
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VITE_DISCORD_UPDATE: string;
	export const SHELL: string;
	export const npm_command: string;
	export const COLORTERM: string;
	export const WSL2_GUI_APPS_ENABLED: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const WSL_DISTRO_NAME: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const WT_SESSION: string;
	export const NODE: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_devDependencies_glob: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_scripts_check_watch: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_private: string;
	export const __ABBR_TIPS_VALUES: string;
	export const SSH_AGENT_PID: string;
	export const npm_package_scripts_build_deploy: string;
	export const EDITOR: string;
	export const npm_package_devDependencies_cz_emoji: string;
	export const NAME: string;
	export const PWD: string;
	export const npm_package_devDependencies_rollup_plugin_copy: string;
	export const npm_package_devDependencies_vite: string;
	export const LOGNAME: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PNPM_HOME: string;
	export const npm_package_scripts_build: string;
	export const npm_package_devDependencies_prettier: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const ABBR_TIPS_PROMPT: string;
	export const VSCODE_INJECTION: string;
	export const __ABBR_TIPS_KEYS: string;
	export const HOME: string;
	export const LANG: string;
	export const WSL_INTEROP: string;
	export const npm_package_devDependencies_typescript: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const WAYLAND_DISPLAY: string;
	export const npm_package_devDependencies_dotenv: string;
	export const GIT_ASKPASS: string;
	export const npm_package_devDependencies_daisyui: string;
	export const npm_package_devDependencies__sveltejs_adapter_static: string;
	export const _tide_location_color: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_rollup_plugin_delete: string;
	export const SSH_ENV: string;
	export const npm_package_scripts_build_css_watch: string;
	export const INIT_CWD: string;
	export const npm_package_dependencies_zod: string;
	export const npm_package_scripts_format: string;
	export const npm_package_devDependencies_vite_plugin_singlefile: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const TERM: string;
	export const npm_package_name: string;
	export const npm_package_type: string;
	export const USER: string;
	export const npm_config_frozen_lockfile: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_package_devDependencies_commitizen: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const _tide_color_separator_same_color: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_scripts_build_push: string;
	export const npm_config_user_agent: string;
	export const npm_package_scripts_lint: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_devDependencies__types_google_apps_script: string;
	export const XDG_RUNTIME_DIR: string;
	export const NODE_PATH: string;
	export const npm_package_dependencies_cheerio: string;
	export const WSLENV: string;
	export const npm_package_scripts_dev: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const XDG_DATA_DIRS: string;
	export const npm_package_scripts_check: string;
	export const PATH: string;
	export const npm_package_devDependencies__types_eslint: string;
	export const npm_config_node_gyp: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_config_registry: string;
	export const HOSTTYPE: string;
	export const ABBR_TIPS_REGEXES: string;
	export const PULSE_SERVER: string;
	export const npm_package_devDependencies_postcss: string;
	export const WT_PROFILE_ID: string;
	export const npm_node_execpath: string;
	export const npm_config_engine_strict: string;
	export const npm_package_devDependencies_clasp: string;
	export const npm_package_devDependencies_postcss_load_config: string;
	export const TERM_PROGRAM: string;
	export const VSCODE_IPC_HOOK_CLI: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_DISCORD_UPDATE: string;
		SHELL: string;
		npm_command: string;
		COLORTERM: string;
		WSL2_GUI_APPS_ENABLED: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		WSL_DISTRO_NAME: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		WT_SESSION: string;
		NODE: string;
		npm_package_devDependencies_tslib: string;
		npm_package_devDependencies_glob: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_scripts_check_watch: string;
		SSH_AUTH_SOCK: string;
		npm_package_private: string;
		__ABBR_TIPS_VALUES: string;
		SSH_AGENT_PID: string;
		npm_package_scripts_build_deploy: string;
		EDITOR: string;
		npm_package_devDependencies_cz_emoji: string;
		NAME: string;
		PWD: string;
		npm_package_devDependencies_rollup_plugin_copy: string;
		npm_package_devDependencies_vite: string;
		LOGNAME: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PNPM_HOME: string;
		npm_package_scripts_build: string;
		npm_package_devDependencies_prettier: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		ABBR_TIPS_PROMPT: string;
		VSCODE_INJECTION: string;
		__ABBR_TIPS_KEYS: string;
		HOME: string;
		LANG: string;
		WSL_INTEROP: string;
		npm_package_devDependencies_typescript: string;
		npm_package_version: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		WAYLAND_DISPLAY: string;
		npm_package_devDependencies_dotenv: string;
		GIT_ASKPASS: string;
		npm_package_devDependencies_daisyui: string;
		npm_package_devDependencies__sveltejs_adapter_static: string;
		_tide_location_color: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_rollup_plugin_delete: string;
		SSH_ENV: string;
		npm_package_scripts_build_css_watch: string;
		INIT_CWD: string;
		npm_package_dependencies_zod: string;
		npm_package_scripts_format: string;
		npm_package_devDependencies_vite_plugin_singlefile: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_script: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_svelte_check: string;
		TERM: string;
		npm_package_name: string;
		npm_package_type: string;
		USER: string;
		npm_config_frozen_lockfile: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_package_devDependencies_commitizen: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		_tide_color_separator_same_color: string;
		npm_package_devDependencies_eslint: string;
		npm_package_scripts_build_push: string;
		npm_config_user_agent: string;
		npm_package_scripts_lint: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_execpath: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_svelte: string;
		npm_package_devDependencies__types_google_apps_script: string;
		XDG_RUNTIME_DIR: string;
		NODE_PATH: string;
		npm_package_dependencies_cheerio: string;
		WSLENV: string;
		npm_package_scripts_dev: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		XDG_DATA_DIRS: string;
		npm_package_scripts_check: string;
		PATH: string;
		npm_package_devDependencies__types_eslint: string;
		npm_config_node_gyp: string;
		npm_package_devDependencies__sveltejs_kit: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_config_registry: string;
		HOSTTYPE: string;
		ABBR_TIPS_REGEXES: string;
		PULSE_SERVER: string;
		npm_package_devDependencies_postcss: string;
		WT_PROFILE_ID: string;
		npm_node_execpath: string;
		npm_config_engine_strict: string;
		npm_package_devDependencies_clasp: string;
		npm_package_devDependencies_postcss_load_config: string;
		TERM_PROGRAM: string;
		VSCODE_IPC_HOOK_CLI: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
