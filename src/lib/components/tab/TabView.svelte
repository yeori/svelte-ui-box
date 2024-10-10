<script lang="ts" strictEvents generics="K extends string | symbol, E extends Record<string, any>">
	import type { SelectionModel } from '../model/selection/selection.model.js';
	import { createEventDispatcher, setContext } from 'svelte';
	import TabContent from './TabContent.svelte';

	export let model: SelectionModel<K>;
	export let contentRendering: 'auto' | 'manual' = 'manual';

	const dispatch = createEventDispatcher<E>();
	setContext('model', { model, dispatch });

	const watchModel = (model: SelectionModel<K>) => {};
	$: watchModel($model);
</script>

<!--
@component

Root component for tab ui.

### props

1. model(required) - model instance for tab ui and iteraction.
1. contentRendering: 'auto' | 'manual' - (default 'manual') for `"manual"` to work, you should insert `<TabContent>...</TabContent>`s for each tabs. 


## 1. `"manual"` | `"auto"`

### 1.1. example - using `"manual"`

```typescript
<script lang="ts">
const model = SelectionModel.build(
		{ key: 'tab1', label: 'Tab#1' },
		{ key: 'tab2', label: 'Tab#2' }
	);
</script>
```
It is tab definition code.

```html
<TabView {model}>
	<TabNavBar />
	<TabContent key={model.keys.main}>
		<p>Tab Content for tab#1</p>
	</TabContent>
	<TabContent key={model.keys.overview}>
		<p>Tab Content for tab#2</p>
	</TabContent>
</TabView>
```

### 1.2. example - using `"auto"`

You might have components for each tabs

```typescript
<script lang="ts">
import UserProfileView from '..';
import HistoryView from '..';

const model = SelectionModel.build(
		{ key: 'user', label: 'Tab#1', content: {ui: UserProfileView} },
		{ key: 'history', label: 'Tab#2', content: {ui: HistoryView} }
	);
</script>
```

Then, you don't have to nest contents of tab manually.

```html
<TabView {model}>
	<TabNavBar />
</TabView>
```

### 1.3. passing props to nested component

Your component `UserProfile` might require a reference to `User`.

```typescript
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type UserEntity from '..';

	export let user: UserEntity; // required
</script>
```

For this to work, you can pass properties to `UserProfile`.

```typescript
<script lang="ts">

	let userData:UserEntity = { id: '...', email: '...' } // user Data to be bound to UserProfile
	
	const model = SelectionModel.build(
			{ key: 'user', label: 'Tab#1',
				content: {
					ui: UserProfileView,
					props: {user: () => userData}
				}
			},
			{ key: 'history', label: 'Tab#2', content: {ui: HistoryView} }
		);
	</script>
```

* `{user: userData}` also works. But it works as `readonly`(if you want to replace the reference later, direct assignment lost reactivity)

## 2. updating | events


### 2.1. updating view

In case of loading another user, call `modal.update()`

```typescript
  let userData:UserEntity = { id: '...', email: '...' } // user Data to be bound to UserProfile
	const model = SelectionModel.build(...);
	
	const loadAnotherUser = async (userSeq:number) => {
		const user = await your.rest.api.loadUser(userSeq);
		userData = user;
		model.update();
	}
```

* Alternative way is to wrap `user` using wriable store(`const userData = writable(user)`). And the custom component receive it as wriable props. (`export let user: Writable<UserEntity>;`). In the case, `{user: userData}` keeps rectivity.

### 2.2. events

The component `UserProfile` emits event `"profile"` to the directory parent.

```typescript
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let user: UserEntity;
	export let dispatch = createEventDispatcher<{ profile: UserEntity }>();
</script>
```
```html
<section>
	<button on:click={() => dispatch('profile', user)}>Send event</button>
</section>
```

`<TabView />` shares it's EventDispatcher to the descendants.

> All events emitted by descendant components behave as if they were emitted by the `<TabView/>` component.

Any nested components must adhere to the following two rules.

1. Name of event dispatcher should be `dispatch`.
1. It should be declared with `export let` keyword.

```typescript
  export let dispatch = createEventDispatcher();
```

Then, you can receive event `"profile"` at `<TabView/>`

```typescript
  let userData;
  const model;

	const showUserDetail = (e:CustomEvent<UserProfile>) => {
		const user = e.detail
	}
```
```html
<TabView {model} on:profile={showUserDetail}>
	<TabNavBar />
</TabView>
```
-->
<div class="tabview">
	<slot />
	{#if contentRendering === 'auto'}
		{#each $model.items as tab}
			{@const props = { ...tab.getProps(), dispatch }}
			<TabContent key={tab.key}><svelte:component this={tab.content?.ui} {...props} /></TabContent>
		{/each}
	{/if}
</div>

<style lang="scss">
	.tabview {
		display: contents;
	}
</style>
