<template>
	<v-app id="inspire">
		<v-navigation-drawer v-model="drawer" app>
			<v-list dense>
				<v-list-item
					link
					:to="item.path"
					v-for="(item, index) in routes"
					:key="index"
				>
					<v-list-item-action>
						<v-icon>mdi-{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{ item.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app color="indigo" dark>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>Application</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<router-view></router-view>
		</v-main>
		<v-footer color="indigo" app>
			<span class="white--text"
				>Fábrica Online - High Tech &copy; {{ new Date().getFullYear() }}</span
			>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	props: {
		source: String,
	},

	data: () => ({
		drawer: null,
		routes: [
			{ path: "/", icon: "home", name: "Home" },
			{ path: "/contas", icon: "cash", name: "Contas" },
			{ path: "/usuarios", icon: "account", name: "Usuarios" },
			{
				path: "/relatorios",
				icon: "align-vertical-bottom",
				name: "Relatorios",
			},
			{ path: "/contato", icon: "email", name: "Contato" },
		],
	}),
};
</script>
